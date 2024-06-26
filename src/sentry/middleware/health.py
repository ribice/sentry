import itertools

import orjson
from django.http import HttpResponse
from django.utils.deprecation import MiddlewareMixin
from rest_framework.request import Request


class HealthCheck(MiddlewareMixin):
    def process_request(self, request: Request):
        # Our health check can't be a done as a view, because we need
        # to bypass the ALLOWED_HOSTS check. We need to do this
        # since not all load balancers can send the expected Host header
        # which would cause a 400 BAD REQUEST, marking the node dead.
        # Instead, we just intercept the request at this point, and return
        # our success/failure immediately.
        if request.path != "/_health/":
            return

        if "full" not in request.GET:
            return HttpResponse("ok", content_type="text/plain")

        from sentry.status_checks import Problem, check_all

        threshold = Problem.threshold(Problem.SEVERITY_CRITICAL)
        results = {
            check: list(filter(threshold, problems)) for check, problems in check_all().items()
        }
        problems = list(itertools.chain.from_iterable(results.values()))

        return HttpResponse(
            orjson.dumps(
                {
                    "problems": [str(p) for p in problems],
                    "healthy": {type(check).__name__: not p for check, p in results.items()},
                }
            ),
            content_type="application/json",
            status=(500 if problems else 200),
        )

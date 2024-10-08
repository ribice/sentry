import {createContext, Fragment, useContext, useEffect} from 'react';
import {createPortal} from 'react-dom';
import type {SerializedStyles} from '@emotion/react';
import {useTheme} from '@emotion/react';
import styled from '@emotion/styled';
import {AnimatePresence} from 'framer-motion';

import {Overlay, PositionWrapper} from 'sentry/components/overlay';
import {space} from 'sentry/styles/space';
import type {UseHoverOverlayProps} from 'sentry/utils/useHoverOverlay';
import {useHoverOverlay} from 'sentry/utils/useHoverOverlay';

interface TooltipContextProps {
  /**
   * Specifies the DOM node where the tooltip should be rendered.
   * This is particularly useful for making the tooltip interactive within specific contexts,
   * such as inside a modal. By default the tooltip is rendered in the 'document.body'.
   */
  container: Parameters<typeof createPortal>[1];
}

export const TooltipContext = createContext<TooltipContextProps>({
  container: document.body,
});

interface TooltipProps extends UseHoverOverlayProps {
  /**
   * The content to show in the tooltip popover
   */
  title: React.ReactNode;
  children?: React.ReactNode;
  /**
   * Disable the tooltip display entirely
   */
  disabled?: boolean;
  /**
   * Additional style rules for the tooltip content.
   */
  overlayStyle?: React.CSSProperties | SerializedStyles;
}

function Tooltip({
  children,
  overlayStyle,
  title,
  disabled = false,
  ...hoverOverlayProps
}: TooltipProps) {
  const {container} = useContext(TooltipContext);
  const theme = useTheme();
  const {wrapTrigger, isOpen, overlayProps, placement, arrowData, arrowProps, reset} =
    useHoverOverlay('tooltip', hoverOverlayProps);

  // Reset the visibility when the tooltip becomes disabled
  useEffect(() => {
    if (disabled) {
      reset();
    }
  }, [reset, disabled]);

  if (disabled || !title) {
    return <Fragment>{children}</Fragment>;
  }

  const tooltipContent = isOpen && (
    <PositionWrapper zIndex={theme.zIndex.tooltip} {...overlayProps}>
      <TooltipContent
        animated
        arrowProps={arrowProps}
        originPoint={arrowData}
        placement={placement}
        overlayStyle={overlayStyle}
      >
        {title}
      </TooltipContent>
    </PositionWrapper>
  );

  return (
    <Fragment>
      {wrapTrigger(children)}
      {createPortal(<AnimatePresence>{tooltipContent}</AnimatePresence>, container)}
    </Fragment>
  );
}

const TooltipContent = styled(Overlay)`
  padding: ${space(1)} ${space(1.5)};
  overflow-wrap: break-word;
  max-width: 225px;
  color: ${p => p.theme.textColor};
  font-size: ${p => p.theme.fontSizeSmall};
  line-height: 1.2;
  text-align: center;
`;

export type {TooltipProps};
export {Tooltip};

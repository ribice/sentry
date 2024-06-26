import styled from '@emotion/styled';

const RepoLabel = styled('span')`
  /* label mixin from bootstrap */
  font-weight: ${p => p.theme.fontWeightBold};
  color: ${p => p.theme.white};
  text-align: center;
  white-space: nowrap;
  border-radius: 0.25em;
  /* end of label mixin from bootstrap */

  ${p => p.theme.overflowEllipsis};

  display: inline-block;
  vertical-align: text-bottom;
  line-height: 1;
  background: ${p => p.theme.gray200};
  padding: 3px;
  max-width: 86px;
  font-size: ${p => p.theme.fontSizeSmall};
`;

export default RepoLabel;

import { css } from '@emotion/react';
import { ThemeLib } from 'src/styles/theme';

const createStyles = (t: ThemeLib) => {
  return {
    wrapper: css`
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      height: 46px;
      padding: 0 ${t.spacing.m}px;
      z-index: ${t.zIndex.header};
    `,
    col1: css`
      display: flex;
      width: 50%;
      flex-shrink: 1;

      h1 {
        font-family: Montserrat, sans-serif;
        font-weight: 300;
        font-size: ${t.typography.size.large}px;
        margin-bottom: 0px;
      }
    `,
    col2: css`
      flex-shrink: 0;
    `,
    col3: css`
      display: flex;
      width: 50%;
      flex-shrink: 1;
      justify-content: flex-end;
      align-items: center;
    `,
    brand: css`
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      color: ${t.color.lightPrimary};

      &:hover {
        color: ${t.color.lightPrimary};
        text-decoration: none;
      }

      img {
        margin-right: ${t.spacing.m / 2}px;
      }
    `,
    share: css`
      display: flex;
      align-items: center;
      font-size: ${t.typography.size.small}px;
      line-height: ${t.typography.size.small}px;
      padding: 0 ${t.spacing.xs}px;
      cursor: pointer;

      svg {
        font-size: ${t.typography.size.medium}px;
        margin-left: ${t.spacing.s / 2}px;
      }
    `,
    tooltip: css`
      max-width: unset;
    `,
    tooltipInner: css`
      padding: ${t.spacing.xs}px ${t.spacing.m}px;
    `,
    tooltipContent: css`
      display: flex;
      flex-direction: row;
    `,
    tooltipUrl: css`
      max-width: 240px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: ${t.spacing.xs}px;
    `,
    tooltipBtn: css`
      font-weight: ${t.typography.weight.medium};
      transition: color ${t.animation.timing.fast}ms ${t.animation.easing.fast};

      &:hover {
        text-decoration: none;
      }
    `,
    userListIndicator: css`
      display: flex;
      align-items: center;
      font-size: ${t.typography.size.small}px;
      line-height: ${t.typography.size.small}px;
      padding: 0 ${t.spacing.xs}px;
      margin-right: ${t.spacing.xs}px;

      svg {
        font-size: ${t.typography.size.medium}px;
        margin-left: ${t.spacing.s / 2}px;
      }
    `,
  };
};

export default createStyles;

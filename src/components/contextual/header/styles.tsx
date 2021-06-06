import { css } from '@emotion/react';
import { ThemeLib } from 'src/styles/theme';

const createStyles = (t: ThemeLib) => {
  return {
    wrapper: css`
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      height: 46px;
      padding: 0 ${t.spacing.m}px;
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
    userListIndicator: css`
      display: inline-flex;
      align-items: center;
      font-size: ${t.typography.size.small}px;
      margin-right: ${t.spacing.s}px;

      svg {
        font-size: 17px;
        margin-left: ${t.spacing.s / 2}px;
      }
    `,
  };
};

export default createStyles;

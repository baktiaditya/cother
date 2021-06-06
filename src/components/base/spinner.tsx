/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, css, useTheme, keyframes } from '@emotion/react';
import { ThemeLib } from 'src/styles/theme';

const Spinner: React.VFC = props => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return <span {...props} css={styles.base} />;
};

const createStyles = (t: ThemeLib) => {
  const colorMixin = (color: string) => css`
    &::before {
      border-top-color: ${color};
      border-right-color: ${color};
    }
  `;

  const sizeMixin = (width: number, height: number) => css`
    width: ${width}px;
    height: ${height}px;

    &::before {
      width: ${width}px;
      height: ${height}px;
      margin-top: -${width / 2}px;
      margin-left: -${height / 2}px;
    }
  `;

  const circular = keyframes`
    to {
      transform: rotate(360deg);
    }
  `;

  return {
    base: css`
      position: relative;

      &::before {
        position: absolute;
        content: '';
        box-sizing: border-box;
        top: 50%;
        left: 50%;
        border-radius: 50%;
        border: ${t.border.width.bold}px solid transparent;
        animation: ${circular} ${t.animation.timing.slow}ms linear infinite;
      }

      ${colorMixin(t.color.lightPrimary)};
      ${sizeMixin(18, 18)};
    `,
  };
};

export default Spinner;

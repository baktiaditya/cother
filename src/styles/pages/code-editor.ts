import { css } from '@emotion/react';
import { lighten } from 'polished';
import { ThemeLib } from 'src/styles/theme';

const createStyles = (t: ThemeLib) => {
  return {
    wrapper: css`
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    `,
    content: css`
      flex: 1;

      .powered-by-firepad {
        display: none;
      }
    `,
    editorLabel: css`
      position: absolute;
      top: 0;
      right: 0;
      color: ${t.color.lightPrimary};
      font-size: ${t.typography.size.tiny}px;
      line-height: ${t.typography.size.tiny}px;
      padding: ${t.spacing.xxs}px ${t.spacing.xs}px;
      background-color: ${t.color.darkPrimary};
      border-bottom-left-radius: ${t.border.radius.default}px;
      z-index: 10;
    `,
    editorContainer: css`
      width: 100%;
      height: 100%;
      font-family: 'Monaco', 'Menlo', 'Consolas', 'Vera Mono', monospace;
      font-size: 13px;
      background-color: ${lighten(0.05, t.color.darkPrimary)};

      &.ace-tomorrow-night {
        background-color: ${lighten(0.05, t.color.darkPrimary)};
      }
    `,
    iframeMask: css`
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: transparent;
      z-index: 100;
    `,
  };
};

export default createStyles;

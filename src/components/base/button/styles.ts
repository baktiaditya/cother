import { css } from '@emotion/react';
import { rgba } from 'polished';
import { ThemeLib } from 'src/styles/theme';

const createStyles = (t: ThemeLib) => {
  return {
    base: css`
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      font-size: ${t.typography.size.small}px;
      padding: ${t.spacing.xxs}px ${t.spacing.s}px;
      margin: 0;
      border: 1px solid transparent;
      border-radius: ${t.border.radius.default}px;
      background-color: transparent;
      border-color: ${t.color.lightPrimary};
      color: ${t.color.lightPrimary};
      user-select: none;
      outline: 0;
      min-width: 40px;
      transition: background-color ${t.animation.timing.fast}ms ${t.animation.easing.fast},
        color ${t.animation.timing.fast}ms ${t.animation.easing.fast};

      &:focus {
        outline: 0;
      }
    `,
    active: css`
      background-color: ${t.color.lightPrimary};
      color: ${t.color.darkPrimary};

      &:hover {
        background-color: ${rgba(t.color.lightPrimary, t.opacity.opaque)};
      }
    `,
    disabled: css`
      &[disabled] {
        opacity: ${t.opacity.translucent};
        cursor: not-allowed;

        &:hover {
          opacity: ${t.opacity.translucent};
        }
      }
    `,
  };
};

export default createStyles;

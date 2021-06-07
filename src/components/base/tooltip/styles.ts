import { css } from '@emotion/react';
import { ThemeLib } from 'src/styles/theme';
import { elevationStyle } from 'src/styles/mixins';

const createStyles = (t: ThemeLib, elevation: 'none' | keyof ThemeLib['elevation']) => {
  const arrowSize = 5;
  const additionalPadding = arrowSize * 2; // additionalPadding must be greater than `arrowSize`
  const {
    animation: { easing, timing },
  } = t;

  const animationConfig = css`
    transition-duration: ${timing.fast}ms;
    transition-property: transform, opacity;
    transition-timing-function: ${easing.fast};
  `;

  const translate = (placement: 'top' | 'right' | 'bottom' | 'left') => {
    let pixel: number;
    let move: string;
    let initial: string;

    switch (placement) {
      case 'top':
      case 'left':
        pixel = -t.spacing.xs;
        break;
      default:
        pixel = t.spacing.xs;
    }

    switch (placement) {
      case 'top':
      case 'bottom':
        initial = `translateY(${pixel}px)`;
        move = `translateY(0)`;
        break;
      default:
        initial = `translateX(${pixel}px)`;
        move = `translateX(0)`;
    }

    return css`
      &[data-placement^='${placement}'] {
        &.appear,
        &.enter {
          transform: ${initial};
        }
        &.appear-active,
        &.enter-active {
          transform: ${move};
        }
        &.appear-done,
        &.enter-done {
          transform: ${move};
        }
      }
    `;
  };

  return {
    base: css`
      font-size: ${t.typography.size.small}px;
      max-width: 260px;
      z-index: ${t.zIndex.tooltip};

      /* ---------------------------------------- */
      /* Animation */
      /* ---------------------------------------- */

      &.appear,
      &.enter {
        opacity: 0.01;
      }
      &.appear-active,
      &.enter-active {
        opacity: 1;
        ${animationConfig};
      }
      &.appear-done,
      &.enter-done {
        opacity: 1;
      }

      &.exit {
        opacity: 1;
      }
      &.exit-active {
        opacity: 0.01;
        ${animationConfig};
      }
      &.exit-done {
        opacity: 0.01;
      }

      ${translate('top')};
      ${translate('right')};
      ${translate('bottom')};
      ${translate('left')};

      &[data-placement^='top'] {
        padding-bottom: ${additionalPadding}px;
      }
      &[data-placement^='right'] {
        padding-left: ${additionalPadding}px;
      }
      &[data-placement^='bottom'] {
        padding-top: ${additionalPadding}px;
      }
      &[data-placement^='left'] {
        padding-right: ${additionalPadding}px;
      }

      /* ---------------------------------------- */
      /* Arrow */
      /* ---------------------------------------- */
      .tooltip-arrow {
        width: 0;
        height: 0;

        &::after {
          position: absolute;
          display: block;
          content: '';
          border-color: transparent;
          border-style: solid;
        }
      }

      &[data-placement^='top'] {
        .tooltip-arrow {
          bottom: 0;

          &::after {
            bottom: ${additionalPadding - arrowSize}px;
            left: -${arrowSize}px;
            border-width: ${arrowSize}px ${arrowSize}px 0 ${arrowSize}px;
            border-top-color: ${t.color.lightPrimary};
          }
        }
      }

      &[data-placement^='right'] {
        .tooltip-arrow {
          left: 0;
          &::after {
            left: ${additionalPadding - arrowSize}px;
            top: -${arrowSize}px;
            border-width: ${arrowSize}px ${arrowSize}px ${arrowSize}px 0;
            border-right-color: ${t.color.lightPrimary};
          }
        }
      }

      &[data-placement^='bottom'] {
        .tooltip-arrow {
          top: 0;
          &::after {
            top: ${additionalPadding - arrowSize}px;
            left: -${arrowSize}px;
            border-width: 0 ${arrowSize}px ${arrowSize}px ${arrowSize}px;
            border-bottom-color: ${t.color.lightPrimary};
          }
        }
      }

      &[data-placement^='left'] {
        .tooltip-arrow {
          right: 0;
          &::after {
            right: ${additionalPadding - arrowSize}px;
            top: -${arrowSize}px;
            border-width: ${arrowSize}px 0 ${arrowSize}px ${arrowSize}px;
            border-left-color: ${t.color.lightPrimary};
          }
        }
      }

      &[data-placement='top-start'],
      &[data-placement='bottom-start'] {
        .tooltip-arrow[data-edge]::after {
          left: -${arrowSize * 4}px;
        }
      }

      &[data-placement='top-end'],
      &[data-placement='bottom-end'] {
        .tooltip-arrow[data-edge]::after {
          left: ${arrowSize * 2}px;
        }
      }

      &[data-placement='right-start'],
      &[data-placement='left-start'] {
        .tooltip-arrow[data-edge]::after {
          top: -${arrowSize * 3}px;
        }
      }

      &[data-placement='right-end'],
      &[data-placement='left-end'] {
        .tooltip-arrow[data-edge]::after {
          top: ${arrowSize}px;
        }
      }
    `,
    inner: css`
      padding: ${t.spacing.xxs}px ${t.spacing.xs}px;
      border-radius: ${t.border.radius.default}px;
      background-color: ${t.color.lightPrimary};
      color: ${t.color.darkPrimary};
      ${elevationStyle(t, elevation)};
    `,
  };
};

export default createStyles;

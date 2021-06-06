import { css } from '@emotion/react';
import { lighten } from 'polished';
import { ThemeLib } from 'src/styles/theme';
import hsizegrip from 'src/img/hsizegrip.png';
import vsizegrip from 'src/img/vsizegrip.png';

const createStyles = (t: ThemeLib) => {
  return {
    // Resizeable
    resizeable: css`
      display: flex;
      overflow: hidden;
    `,
    resizeableTypeRow: css`
      flex-flow: row wrap;
    `,
    resizeableTypeColumn: css`
      flex-flow: column wrap;
    `,

    // Cell
    cell: css`
      position: relative;
      flex-basis: 0;
      flex-grow: 1;
      background-color: ${t.color.lightPrimary};
    `,
    cellTypeRow: css`
      max-width: 100%;
      min-height: 1px;
    `,
    cellTypeColumn: css`
      max-height: 100%;
      min-width: 1px;
    `,

    // Splitter
    splitter: css`
      position: relative;

      &::after {
        position: absolute;
        content: '';
        top: 0;
        z-index: 10;
        background-color: ${lighten(0.05, t.color.darkPrimary)};
      }
    `,
    splitterVertical: css`
      background: url('${vsizegrip}') center center no-repeat ${t.color.darkPrimary};
      cursor: col-resize;
      z-index: 10;

      &::after {
        right: 0;
        width: 1px;
        height: 100%;
      }
    `,
    splitterHorizontal: css`
      background: url('${hsizegrip}') center center no-repeat ${t.color.darkPrimary};
      cursor: row-resize;
      z-index: 10;

      &::after {
        left: 0;
        height: 1px;
        width: 100%;
      }
    `,
    splitterDragging: css`
      background-color: ${lighten(0.2, t.color.darkPrimary)};
    `,
  };
};

export default createStyles;

/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, useTheme } from '@emotion/react';
import { ResizeSensor } from 'css-element-queries';
import isFunction from 'lodash/isFunction';
import { isSafari } from 'src/utils';
import createStyles from './styles';

export type CellProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  /** @default 0 */
  height?: number | string;
  onDimensionChange?: () => void;
  /** @default 'row'' */
  type?: 'row' | 'column';
  /** @default 0 */
  width?: number | string;
};

export type CellRef = HTMLDivElement;

const Cell = React.forwardRef<CellRef, CellProps>((props, ref) => {
  const { height, onDimensionChange, style, type = 'row', width, ...rest } = props;
  const currentRef = React.useRef<HTMLDivElement>();
  const theme = useTheme();
  const styles = createStyles(theme);

  React.useEffect(() => {
    const target = currentRef.current;
    if (target) {
      new ResizeSensor(target, () => {
        onDimensionChange && onDimensionChange();
      });
    }

    return () => {
      if (target) {
        ResizeSensor.detach(target);
      }
    };
  }, []);

  const getRef = (element: HTMLDivElement) => {
    currentRef.current = element;

    if (ref) {
      if (isFunction(ref)) {
        ref(element);
      } else {
        ref.current = element;
      }
    }
  };

  const componentStyle: React.CSSProperties = {};
  if (type === 'row') {
    if (width) {
      componentStyle.flex = `0 0 ${width}px`;
      componentStyle.maxWidth = width;
    }
  } else {
    if (height) {
      componentStyle.flex = `0 0 ${height}px`;
      componentStyle.maxHeight = height;
    }
  }

  if (isSafari) {
    componentStyle.height = '100%';
  }

  return (
    <div
      {...rest}
      ref={getRef}
      css={[styles.cell, type === 'row' ? styles.cellTypeRow : styles.cellTypeColumn]}
      style={{ ...componentStyle, ...style }}
    />
  );
});

export default Cell;

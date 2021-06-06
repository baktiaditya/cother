/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, useTheme } from '@emotion/react';
import { isSafari } from 'src/utils';
import createStyles from './styles';

type ResizeableProps = React.HtmlHTMLAttributes<HTMLDivElement> & {
  fullScreen?: boolean;
  height?: string | number;
  type?: 'row' | 'column';
};

const Resizeable: React.FC<ResizeableProps> = props => {
  const { children, fullScreen = false, height = '100%', style, type = 'row', ...rest } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const styles = createStyles(theme);

  React.useEffect(() => {
    if (type === 'column' && fullScreen === true) {
      window.addEventListener('resize', updateComponentMaxHeight);
    }

    return () => {
      if (type === 'column' && fullScreen === true) {
        window.removeEventListener('resize', updateComponentMaxHeight);
      }
    };
  }, []);

  const updateComponentMaxHeight = () => {
    const target = ref.current;
    if (!target) {
      return;
    }
    const h = window.innerHeight;
    const w = window.innerWidth;
    const top = target.getBoundingClientRect().top;
    const left = target.getBoundingClientRect().left;

    target.style.maxWidth = `${w - left}px`;
    target.style.minWidth = `${w - left}px`;
    target.style.maxHeight = `${h - top}px`;
    target.style.minHeight = `${h - top}px`;
  };

  const componentStyle: React.CSSProperties = {
    minHeight: height,
    maxHeight: height,
  };

  if (isSafari) {
    componentStyle.height = height;
  }

  return (
    <div
      {...rest}
      ref={ref}
      css={[
        styles.resizeable,
        type === 'row' ? styles.resizeableTypeRow : styles.resizeableTypeColumn,
      ]}
      style={{ ...componentStyle, ...style }}
      data-style="display: flex;"
    >
      {children}
    </div>
  );
};

export default Resizeable;

import { css } from '@emotion/react';
import { ThemeLib } from './theme';
import { rgba } from 'polished';

export const elevationStyle = (t: ThemeLib, elevation: 'none' | keyof ThemeLib['elevation']) => {
  let style;
  const {
    elevation: { container, raised, float, hover },
  } = t;

  switch (elevation) {
    case 'container':
      style = css`
        box-shadow: ${container.shadowOffset.width}px ${container.shadowOffset.height}px
          ${container.shadowRadius}px ${rgba(container.shadowColor, container.shadowOpacity)};
      `;
      break;
    case 'raised':
      style = css`
        box-shadow: ${raised.shadowOffset.width}px ${raised.shadowOffset.height}px
          ${raised.shadowRadius}px ${rgba(raised.shadowColor, raised.shadowOpacity)};
      `;
      break;
    case 'float':
      style = css`
        box-shadow: ${float.shadowOffset.width}px ${float.shadowOffset.height}px
          ${float.shadowRadius}px ${rgba(float.shadowColor, float.shadowOpacity)};
      `;
      break;
    case 'hover':
      style = css`
        box-shadow: ${hover.shadowOffset.width}px ${hover.shadowOffset.height}px
          ${hover.shadowRadius}px ${rgba(hover.shadowColor, hover.shadowOpacity)};
      `;
      break;
    default:
      style = css`
        box-shadow: none;
      `;
  }

  return style;
};

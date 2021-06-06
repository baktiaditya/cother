import '@emotion/react';
import { ThemeLib } from '../src/styles/theme';

declare module '@emotion/react' {
  export interface Theme extends ThemeLib {}
}

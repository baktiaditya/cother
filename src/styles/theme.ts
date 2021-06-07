import facepaint, { DynamicStyle } from 'facepaint';
import { CSSObject } from '@emotion/react';

// Animation
const animation = {
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    fast: 'cubic-bezier(0.4, 0, 0.2, 1)',
    normal: 'cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// Color
const color = {
  lightPrimary: '#ffffff',
  lightStain: '#fafafa',
  lightNeutral: '#cccccc',
  lightSecondary: '#aaaaaa',

  darkPrimary: '#0d1117',

  bluePrimary: '#0194f3',
  purplePrimary: '#952FD3A6',
  redPrimary: '#ce352d',
  greenPrimary: '#47b920',
  yellowPrimary: '#e3b341',
} as const;

// Opacity
const opacity = {
  opaque: 0.9,
  obscure: 0.65,
  translucent: 0.5,
  washedOut: 0.4,
  seeThrough: 0.2,
  clear: 0.1,
} as const;

// Spacing
const spacing = {
  xxs: 4,
  xs: 8,
  s: 12,
  m: 16,
  ml: 20,
  l: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
  xxxxl: 56,
} as const;

// Border
const border = {
  width: {
    thin: 0.5,
    thick: 1,
    bold: 2,
  },
  radius: {
    default: 4,
    rounded: '50%',
  },
} as const;

// Typography
const typography = {
  family: {
    sansSerif:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    monospace:
      'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  weight: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  size: {
    gigantic: 48,
    huge: 32,
    big: 24,
    large: 18,
    medium: 16,
    small: 14,
    tiny: 12,
    micro: 11,
  },
  lineHeight: 1.5,
} as const;

// Breakpoints
export const breakpoints = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
} as const;

export const mq: (style: { [key in keyof CSSObject]: Array<string | number> }) => DynamicStyle[] =
  facepaint([
    `@media(min-width: ${breakpoints.sm}px)`,
    `@media(min-width: ${breakpoints.md}px)`,
    `@media(min-width: ${breakpoints.lg}px)`,
    `@media(min-width: ${breakpoints.xl}px)`,
  ]);

// Grid
const grid = {
  gutter: spacing.ml,
  column: 12,
  container: {
    sm: 480,
    md: 720,
    lg: 960,
    xl: 1140,
  },
} as const;

// Elevation
const elevation = {
  container: {
    shadowColor: color.darkPrimary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: opacity.seeThrough,
    shadowRadius: 2,
  },
  raised: {
    shadowColor: color.darkPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: opacity.clear,
    shadowRadius: 5,
  },
  float: {
    shadowColor: color.darkPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: opacity.clear,
    shadowRadius: 10,
  },
  hover: {
    shadowColor: color.darkPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: opacity.seeThrough,
    shadowRadius: 16,
  },
} as const;

// Z-index
const zIndex = {
  header: 1010,
  tooltip: 1040,
  popover: 1040,
} as const;

const theme = {
  animation,
  border,
  breakpoints,
  color,
  grid,
  elevation,
  mq,
  opacity,
  spacing,
  typography,
  zIndex,
};

export type ThemeLib = typeof theme;

export default theme;

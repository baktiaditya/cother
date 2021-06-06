import snakeCase from 'lodash/snakeCase';

/**
 * @see https://stackoverflow.com/a/24457420
 */
export function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

/**
 * @see https://github.com/microsoft/TypeScript/pull/12253#issuecomment-393954723
 */
export const keys = Object.keys as <T>(o: T) => Extract<keyof T, string>[];

export function slugify(str: string) {
  return snakeCase(str).replace(/_/g, '-');
}

export const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

export const isSafari = isBrowser
  ? window.navigator.vendor &&
    window.navigator.vendor.indexOf('Apple') > -1 &&
    window.navigator.userAgent &&
    !window.navigator.userAgent.match('CriOS')
  : false;

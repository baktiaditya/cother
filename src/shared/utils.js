import _ from 'lodash';

export function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

export function hexPropTypes(props, propName, componentName) {
  if (props[propName]) {
    const value = props[propName];
    // https://github.com/benwiley4000/react-extra-prop-types/blob/master/lib/validators/isColor.js
    if (!/^#(?:[A-Fa-f0-9]{3}){1,2}$/i.test(value)) {
      return new Error(
        `\`${propName}\` in \`${componentName}\` must be a hex color format.`
      );
    }
  }

  // assume all ok
  return null;
}

export function slugify(string) {
  return _.snakeCase(string).replace(/_/g, '-');
}

export const isBrowser = !!((typeof window !== 'undefined' && window.document && window.document.createElement));
export const isSafari = isBrowser ? window.navigator.vendor && window.navigator.vendor.indexOf('Apple') > -1 &&
  window.navigator.userAgent && !window.navigator.userAgent.match('CriOS') : false;

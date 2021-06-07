import React from 'react';
import snakeCase from 'lodash/snakeCase';
import isString from 'lodash/isString';

export type TargetPropType = string | React.RefObject<HTMLElement | SVGElement>;

export function getTarget(target: TargetPropType) {
  if (target && typeof target === 'object' && 'current' in target) {
    return target.current;
  } else if (isString(target)) {
    let selection = document.querySelectorAll(target);
    if (!selection.length) {
      selection = document.querySelectorAll(`#${target}`);
    }
    if (!selection.length) {
      console.warn(
        `The target '${target}' could not be identified in the dom, tip: check spelling`,
      );
      return null;
    }
    if (selection instanceof NodeList) {
      const elsArr = Array.from(selection);
      return elsArr[0] as HTMLElement;
    }
  }
  return null;
}

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

// Hooks
// -----------------------------------------------------------------

export function useDidMount(callback: React.EffectCallback) {
  React.useEffect(() => {
    callback();
  }, []);
}

/**
 * I also made it to support running when specific values update in deps
 * The default value for deps will be undefined if you did not pass it
 * and will have the same effect as not passing the parameter to useEffect
 * so it watch for general updates by default
 * @example useDidUpdate(() => {
    if (prevProps && prevProps.inputValue !== inputValue) {
      setState({
        inputValue,
      });
    }
  }, [inputValue]);
 */
export function useDidUpdate(callback: React.EffectCallback, deps?: React.DependencyList) {
  const hasMount = React.useRef(false);

  React.useEffect(() => {
    if (hasMount.current) {
      callback();
    } else {
      hasMount.current = true;
    }
  }, deps);
}

/**
 * @example const prevProps = usePrevious<PropsDefinition>(props);
 */
export const usePrevious = <T>(value: T) => {
  const ref = React.useRef<T>();
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export function useWillUnmount(callback: React.EffectCallback) {
  React.useEffect(() => {
    // returned function will be called on component unmount
    return () => {
      callback();
    };
  }, []);
}

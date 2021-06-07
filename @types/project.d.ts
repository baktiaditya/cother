declare module '*.ico';
declare module '*.png';
declare module '*.jpg';
declare module '*.svg';
declare module '*.eot';
declare module '*.ttf';
declare module '*.otf';
declare module '*.woff';
declare module '*.woff2';
declare module '*.txt';

declare module 'cother' {
  export type Pane = 'html' | 'css' | 'javascript' | 'result';

  export type ReduxState = {
    app: {
      activePane: Array<Pane>;
      loading: boolean;
      totalUser: number;
    };
  };
}

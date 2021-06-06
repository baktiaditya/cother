import React from 'react';
import { Global, ThemeProvider } from '@emotion/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ReactGA from 'react-ga';
import { PROJECT_NAME, GA_TRACKING_ID } from 'src/contants';
import { wrapper } from 'src/store';
import theme from 'src/styles/theme';
import globalStyles from 'src/styles/global';
import '@fortawesome/fontawesome-svg-core/styles.css'; // for icon component

const MyApp: React.VFC<AppProps> = ({ Component, pageProps }) => {
  const router = useRouter();

  // favicon
  React.useEffect(() => {
    const head = document.getElementsByTagName('head')[0];
    const lightSchemeIcon = document.querySelector('link#light-scheme-icon');
    const darkSchemeIcon = document.querySelector('link#dark-scheme-icon');
    const matcher = window.matchMedia('(prefers-color-scheme: dark)');

    const injectFavicon = (mode: 'light' | 'dark') => {
      const link = document.createElement('link');
      link.type = 'image/svg+xml';
      link.rel = 'icon';
      link.href = mode === 'light' ? '/img/favicon-dark.svg' : '/img/favicon-light.svg';
      link.id = mode === 'light' ? 'light-scheme-icon' : 'dark-scheme-icon';
      head.appendChild(link);
    };

    const onUpdate = () => {
      if (matcher.matches) {
        // dark mode is enabled
        lightSchemeIcon && lightSchemeIcon.remove();
        injectFavicon('dark');
      } else {
        // light mode is enabled
        darkSchemeIcon && darkSchemeIcon.remove();
        injectFavicon('light');
      }
    };

    onUpdate();
    matcher.addEventListener('change', onUpdate);

    return () => {
      matcher.removeEventListener('change', onUpdate);
    };
  }, []);

  // google analytic
  React.useEffect(() => {
    const url = window.location.pathname + window.location.search;
    ReactGA.initialize(GA_TRACKING_ID);
    ReactGA.pageview(url);

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, []);

  const handleRouteChange = (url: string) => {
    ReactGA.pageview(url);
  };

  return (
    <ThemeProvider theme={theme}>
      <Global styles={[globalStyles(theme)]} />

      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{PROJECT_NAME} &bull; Collaborative Code Editor</title>
        <meta
          name="description"
          content={`${PROJECT_NAME} is a real-time collaborative code editor and previewer.`}
        />
      </Head>

      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default wrapper.withRedux(MyApp);

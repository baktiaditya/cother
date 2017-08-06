import React from 'react';
import { Router, browserHistory } from 'react-router';
import ReactGA from 'react-ga';
import routes from '../../shared/routes';

const App = () => {
  const routerProps = {
    history: browserHistory,
    routes
  };

  if (process.env.NODE_ENV === 'production') {
    ReactGA.initialize('UA-26982489-22');
    routerProps.onUpdate = () => {
      ReactGA.set({ page: window.location.pathname + window.location.search });
      ReactGA.pageview(window.location.pathname + window.location.search);
    };
  }

  return <Router {...routerProps} />;
};

export default App;

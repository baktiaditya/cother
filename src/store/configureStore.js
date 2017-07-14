import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const isProduction = process.env.NODE_ENV === 'production';

const composeEnhancers =
  typeof window === 'object' && !isProduction &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(
    thunk
  )
);

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    enhancer
  );

  // Hot reload
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    // https://facebook.github.io/react-native/blog/2016/03/24/introducing-hot-reloading.html
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}

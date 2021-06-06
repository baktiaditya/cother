import { ReduxState } from 'cother';
import { createStore, applyMiddleware, Middleware, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { MakeStore, createWrapper, Context, HYDRATE } from 'next-redux-wrapper';
import rootReducers from './reducers';
import { ActionTypes as AppActionTypes } from './actions/action_app.types';

interface HydrateAction {
  type: typeof HYDRATE;
  payload: ReduxState;
}

const bindMiddleware = (middleware: Array<Middleware>) => {
  if (process.env.NODE_ENV !== 'production') {
    const { composeWithDevTools } = require('redux-devtools-extension');
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const reducer = (state: ReduxState | undefined, action: HydrateAction | AppActionTypes) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    return nextState;
  } else {
    return rootReducers(state, action);
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const initStore: MakeStore<Store<ReduxState>> = (context: Context) => {
  return createStore(reducer, bindMiddleware([thunkMiddleware]));
};

export const wrapper = createWrapper<Store<ReduxState>>(initStore);

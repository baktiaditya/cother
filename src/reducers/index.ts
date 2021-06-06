import { combineReducers } from 'redux';
import appReducer from './reducer_app';

const rootReducer = combineReducers({
  app: appReducer,
});

export default rootReducer;

import { combineReducers } from 'redux';
import testReducer from './reducer_test';

const rootReducer = combineReducers({
  test: testReducer
});

export default rootReducer;

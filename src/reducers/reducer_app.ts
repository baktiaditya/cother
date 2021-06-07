import { ReduxState } from 'cother';
import {
  SET_TOTAL_USER,
  ADD_ACTIVE_PANE,
  REMOVE_ACTIVE_PANE,
  SET_LOADING,
  RESET,
} from 'src/actions/types';
import { ActionTypes } from 'src/actions/action_app.types';

type State = ReduxState['app'];

export const INITIAL_STATE: State = {
  activePane: ['html', 'css', 'result'],
  loading: true,
  totalUser: 0,
};

function reducer(state: State = INITIAL_STATE, action: ActionTypes): State {
  switch (action.type) {
    case SET_TOTAL_USER:
      return {
        ...state,
        totalUser: action.payload,
      };
    case ADD_ACTIVE_PANE:
      return {
        ...state,
        activePane: [...state.activePane, action.payload],
      };
    case REMOVE_ACTIVE_PANE:
      return {
        ...state,
        activePane: state.activePane.filter(item => item !== action.payload),
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
}

export default reducer;

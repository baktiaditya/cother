import { Action, Dispatch } from 'redux';
import { Pane } from 'cother';
import { SET_TOTAL_USER, ADD_ACTIVE_PANE, REMOVE_ACTIVE_PANE, SET_LOADING, RESET } from './types';
import {
  SetTotalUser,
  AddActivePane,
  RemoveActivePane,
  SetLoading,
  Reset,
} from './action_app.types';

// Action Creator
export const setTotalUser =
  (num: number) =>
  (dispatch: Dispatch<SetTotalUser>): Action => {
    return dispatch({ type: SET_TOTAL_USER, payload: num });
  };

export const addActivePane =
  (pane: Pane) =>
  (dispatch: Dispatch<AddActivePane>): Action => {
    return dispatch({ type: ADD_ACTIVE_PANE, payload: pane });
  };

export const removeActivePane =
  (pane: Pane) =>
  (dispatch: Dispatch<RemoveActivePane>): Action => {
    return dispatch({ type: REMOVE_ACTIVE_PANE, payload: pane });
  };

export const setLoading =
  (loading: boolean) =>
  (dispatch: Dispatch<SetLoading>): Action => {
    return dispatch({ type: SET_LOADING, payload: loading });
  };

export const reset =
  () =>
  (dispatch: Dispatch<Reset>): Action => {
    return dispatch({ type: RESET });
  };

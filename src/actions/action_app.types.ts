import { Pane } from 'cother';
import { SET_TOTAL_USER, ADD_ACTIVE_PANE, REMOVE_ACTIVE_PANE, SET_LOADING, RESET } from './types';

export interface SetTotalUser {
  type: typeof SET_TOTAL_USER;
  payload: number;
}

export interface AddActivePane {
  type: typeof ADD_ACTIVE_PANE;
  payload: Pane;
}

export interface RemoveActivePane {
  type: typeof REMOVE_ACTIVE_PANE;
  payload: Pane;
}

export interface SetLoading {
  type: typeof SET_LOADING;
  payload: boolean;
}

export interface Reset {
  type: typeof RESET;
}

export type ActionTypes = SetTotalUser | AddActivePane | RemoveActivePane | SetLoading | Reset;

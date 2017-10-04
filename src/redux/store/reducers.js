// @flow

import {
  LOGOUT
} from '../modules/sharedActions';

import {
  audios,
  resetReducer
} from '../modules';

import { combineReducers } from 'redux';

const appReducer = combineReducers({
  audios
});

export default function rootReducer(state, action) {
  let finalState = appReducer(state, action);

  if (action.type === LOGOUT) {
    finalState = resetReducer(finalState, action);
  }

  return finalState;
}

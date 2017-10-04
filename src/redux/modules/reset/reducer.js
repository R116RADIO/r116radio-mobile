// @flow

import {
  LOGOUT
} from '../sharedActions';

import { defaultReducers } from '../defaultReducers';

export default function resetReducer(state, action) {
  switch (action.type) {
    case LOGOUT: {
      return {
        ...state,
        ...defaultReducers
      };
    }
    default:
      return state;
  }
}

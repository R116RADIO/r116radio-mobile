// @flow

import type { Action } from 'AppTypes';

import {
  FETCH_AUDIOS_SUCCESS
} from './actions';
import { uniqBy } from 'lodash';

export const DEFAULT = {};

export default function audios(state = DEFAULT, action: Action = {}) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_AUDIOS_SUCCESS: {
      return payload;
    }
    default:
      return state;
  }
}

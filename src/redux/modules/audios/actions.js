// @flow

import { createAction } from 'redux-actions';
import { createPromiseAction } from '../utils';

/**
 * Action Types
 */

export const FETCH_AUDIOS = 'audios/FETCH_AUDIOS';
export const FETCH_AUDIOS_SUCCESS = 'audios/FETCH_AUDIOS_SUCCESS';

/**
 * Action Creators
 */
export const audioActionCreators = {
  fetchAudios: createPromiseAction(FETCH_AUDIOS),
  fetchAudiosSuccess: createAction(FETCH_AUDIOS_SUCCESS)
};

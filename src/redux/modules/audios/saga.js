// @flow

import {
  take,
  put,
  call,
  fork,
  all
} from 'redux-saga/effects';

import {
  FETCH_AUDIOS,
  audioActionCreators
} from './actions';

import {
  App_Service
} from 'AppServices';
import { apiConfig } from 'AppConfig';

export function* asyncFetchAudios({ resolve, reject }) {
  try {
    const response = yield call(App_Service,
      { url: apiConfig.endpoint, method: 'GET', params: null });

    if (response.data) {
      yield put(audioActionCreators.fetchAudiosSuccess(response.data));
      resolve();
    } else {
      reject();
    }
  } catch (e) {
    reject(e);
  }
}

export function *watchFetchAudios() {
  while (true) {
    const action: Action = yield take(FETCH_AUDIOS);
    yield* asyncFetchAudios(action);
  }
}

export default function* (): Iterable {
  yield all([
    fork(watchFetchAudios)
  ]);
}

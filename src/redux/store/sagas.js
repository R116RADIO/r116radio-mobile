// @flow

import { fork, all } from 'redux-saga/effects';
import {
  audiosSaga
} from '../modules';

type Saga = Iterable<*>;

export default function* rootSaga(): Saga {
  yield all([
    fork(audiosSaga)
  ]);
}

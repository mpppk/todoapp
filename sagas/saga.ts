import { all } from '@redux-saga/core/effects';
import { sessionWatchers } from './session';
import { projectWatchers, taskWatchers } from './task';
import { todoWatchers } from './todo';

export default function* rootSaga() {
  yield all([
    ...sessionWatchers,
    ...todoWatchers,
    ...taskWatchers,
    ...projectWatchers
  ]);
}

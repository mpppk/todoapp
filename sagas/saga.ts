import { all } from '@redux-saga/core/effects';
import { watchIncrementAsync } from './counter';
import { firestoreWatchers } from './firestore';
import { sessionWatchers } from './session';
import { taskWatchers } from './task';
import { todoWatchers } from './todo';

export default function* rootSaga() {
  yield all([
    watchIncrementAsync(),
    ...sessionWatchers,
    ...firestoreWatchers,
    ...todoWatchers,
    ...taskWatchers
  ]);
}

import { all } from '@redux-saga/core/effects';
import { watchIncrementAsync } from './counter';
import { firestoreWatchers } from './firestore';
import { sessionWatchers } from './session';

export default function* rootSaga() {
  yield all([watchIncrementAsync(), ...sessionWatchers, ...firestoreWatchers]);
}

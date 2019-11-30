import { fork, take } from '@redux-saga/core/effects';
import 'firebase/firestore';
import { sessionActionCreators } from '../actions/session';
import { taskCollectionActionCreator } from '../actions/todo';
import { bindFireStoreCollection, takeEveryStartedAction } from './firestore';

export const taskWorkers = bindFireStoreCollection(taskCollectionActionCreator);

export function* observe() {
  yield take(sessionActionCreators.finishFirebaseInitializing);
  yield fork(taskWorkers.observe);
}

export const taskWatchers = [
  ...takeEveryStartedAction(taskCollectionActionCreator, taskWorkers),
  observe()
];

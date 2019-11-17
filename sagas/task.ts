import { fork, take } from '@redux-saga/core/effects';
import { sessionActionCreators } from '../actions/session';
import {
  projectCollectionActionCreator,
  taskCollectionActionCreator
} from '../actions/todo';
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

const projectWorkers = bindFireStoreCollection(projectCollectionActionCreator);

function* observeProjects() {
  yield take(sessionActionCreators.finishFirebaseInitializing);
  yield fork(projectWorkers.observe);
}

export const projectWatchers = [
  ...takeEveryStartedAction(projectCollectionActionCreator, projectWorkers),
  observeProjects()
];

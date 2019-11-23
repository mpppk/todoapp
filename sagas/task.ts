import { fork, take } from '@redux-saga/core/effects';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { SubscribeActionPayload } from '../actions/firestore';
import { sessionActionCreators } from '../actions/session';
import {
  projectCollectionActionCreator,
  taskCollectionActionCreator
} from '../actions/todo';
import { State } from '../reducer';
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

const projectsQueryBuilder = (
  _context: SubscribeActionPayload,
  state: State,
  collection: firebase.firestore.CollectionReference
) => {
  const uid = state.user ? state.user.uid : null;
  return collection.where('ownerId', '==', uid);
};

const projectWorkers = bindFireStoreCollection(
  projectCollectionActionCreator,
  projectsQueryBuilder
);

function* observeProjects() {
  yield take(sessionActionCreators.finishFirebaseInitializing);
  yield fork(projectWorkers.observe);
}

export const projectWatchers = [
  ...takeEveryStartedAction(projectCollectionActionCreator, projectWorkers),
  observeProjects()
];

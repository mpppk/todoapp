import { fork, take } from '@redux-saga/core/effects';
import * as firebase from 'firebase';
import { SubscribeActionPayload } from '../actions/firestore';
import { sessionActionCreators } from '../actions/session';
import { projectCollectionActionCreator } from '../actions/todo';
import { State } from '../reducer';
import { bindFireStoreCollection, takeEveryStartedAction } from './firestore';

const projectsQueryBuilder = (
  _context: SubscribeActionPayload,
  state: State,
  collection: firebase.firestore.CollectionReference
) => {
  const uid = state.global.user ? state.global.user.id : null;
  return collection.where(`members.${uid}`, 'in', [
    'projectOwner',
    'projectWriter',
    'projectReader'
  ]);
};

const projectWorkers = bindFireStoreCollection(projectCollectionActionCreator, {
  subscribe: projectsQueryBuilder
});

function* observeProjects() {
  yield take(sessionActionCreators.finishFirebaseInitializing);
  yield fork(projectWorkers.observe);
}

export const projectWatchers = [
  ...takeEveryStartedAction(projectCollectionActionCreator, projectWorkers),
  observeProjects()
];

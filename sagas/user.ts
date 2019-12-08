import { fork, take } from '@redux-saga/core/effects';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { SubscribeActionPayload } from '../actions/firestore';
import { sessionActionCreators } from '../actions/session';
import { userCollectionActionCreator } from '../actions/user';
import { State } from '../reducer';
import { bindFireStoreCollection, takeEveryStartedAction } from './firestore';

const usersQueryBuilder = (
  context: SubscribeActionPayload,
  _state: State,
  collection: firebase.firestore.CollectionReference
) => {
  const projectId = (context as any).projectId;
  return collection.where(`projects.${projectId}`, 'in', [
    'projectOwner',
    'projectWriter',
    'projectReader'
  ]);
};

export const userWorkers = bindFireStoreCollection(
  userCollectionActionCreator,
  {
    subscribe: usersQueryBuilder
  }
);

export function* observeUsers() {
  yield take(sessionActionCreators.finishFirebaseInitializing);
  yield fork(userWorkers.observe);
}

export const userWatchers = [
  ...takeEveryStartedAction(userCollectionActionCreator, userWorkers),
  observeUsers()
];

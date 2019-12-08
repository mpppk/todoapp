import { fork, take, takeEvery } from '@redux-saga/core/effects';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Action } from 'typescript-fsa';
import { SubscribeActionPayload } from '../actions/firestore';
import { sessionActionCreators } from '../actions/session';
import {
  userCollectionActionCreator,
  userCollectionQueryActionCreators
} from '../actions/user';
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

const candidateProjectMemberQueryBuilder = (
  context: SubscribeActionPayload,
  _state: State,
  collection: firebase.firestore.CollectionReference
) => {
  return collection
    .orderBy('displayName')
    .startAt(context)
    .endAt(context + '\uf8ff')
    .limit(5);
};

export const userWorkers = bindFireStoreCollection(
  userCollectionActionCreator,
  userCollectionQueryActionCreators,
  {
    queries: {
      searchProjectMemberCandidate: candidateProjectMemberQueryBuilder
    },
    subscribe: usersQueryBuilder
  }
);

export function* observeUsers() {
  yield take(sessionActionCreators.finishFirebaseInitializing);
  yield fork(userWorkers.observe);
}

export const userWatchers = [
  ...takeEveryStartedAction(userCollectionActionCreator, userWorkers),
  observeUsers(),
  (function*() {
    yield takeEvery(
      userCollectionQueryActionCreators.searchProjectMemberCandidate.started,
      (action: Action<any>) => {
        return userWorkers.queries.searchProjectMemberCandidate(action.payload);
      }
    );
  })()
];

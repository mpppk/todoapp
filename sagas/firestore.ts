import { call, takeEvery } from '@redux-saga/core/effects';
import firebase from 'firebase';
import { Action } from 'typescript-fsa';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import {
  firestoreAsyncActionCreators,
  IRequestToGetTasksPayload
} from '../actions/firestore';
import { sessionActionCreators } from '../actions/session';

const requestToGetTasksWorker = bindAsyncAction(
  firestoreAsyncActionCreators.getTasks
)(function*(_params: IRequestToGetTasksPayload) {
  const collection = firebase.firestore().collection('tasks');
  const querySnapshot = yield call(collection.get.bind(collection));
  return querySnapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) =>
    doc.data()
  );
});

function* worker(action: Action<IRequestToGetTasksPayload>) {
  yield call(requestToGetTasksWorker, action.payload);
}

function* watchFinishFirebaseInitializing() {
  yield takeEvery(
    sessionActionCreators.finishFirebaseInitializing.type,
    worker
  );
}

export const firestoreWatchers = [watchFinishFirebaseInitializing()];

import firebase from 'firebase';
import { eventChannel } from 'redux-saga';
import { call, fork, put, take, takeEvery } from 'redux-saga/effects';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import { ICollectionActionCreator } from '../actions/firestore';
import {
  sessionActionCreators,
  sessionAsyncActionCreators
} from '../actions/session';
import { taskCollectionActionCreator } from '../actions/todo';
import {
  fromFirebaseUserToUser,
  initializeFirebase
} from '../services/session';
import { watchCollectionSnapShot } from './firestore';

const logoutWorker = bindAsyncAction(sessionAsyncActionCreators.logout)(
  function*() {
    const auth = firebase.auth();
    yield call(auth.signOut.bind(auth));
  }
);

const watchAuthStateChanged = () => {
  return eventChannel(emitter => {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      const user = firebaseUser ? fromFirebaseUserToUser(firebaseUser) : null;
      emitter({ user });
    });
    return () => {}; // tslint:disable-line
  });
};

export function* saga() {
  const chan = yield call(watchAuthStateChanged);
  try {
    while (true) {
      const { user } = yield take(chan);
      yield put(sessionActionCreators.updateUser({ user }));
    }
  } finally {
  } // tslint:disable-line
}

function* watchRequestToInitializeFirebase() {
  yield takeEvery(
    sessionActionCreators.requestToInitializeFirebase.type,
    initializeFirebaseWorkerWrapper
  );
}

function* watchRequestToLogout() {
  yield takeEvery(sessionActionCreators.requestToLogout.type, logoutWorker);
}

export const sessionWatchers = [
  watchRequestToInitializeFirebase(),
  watchRequestToLogout()
];

function* initializeFirebaseWorkerWrapper() {
  initializeFirebase();
  yield put(sessionActionCreators.finishFirebaseInitializing());
  yield fork(saga);
  const collection = firebase.firestore().collection('tasks');
  watchCollectionSnapShot(collection, taskCollectionActionCreator);
  yield fork(
    watchCollectionSnapShot.bind(
      watchCollectionSnapShot,
      collection,
      taskCollectionActionCreator as ICollectionActionCreator<any> // FIXME
    )
  );
}

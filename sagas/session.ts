import firebase from 'firebase';
import _ from 'lodash';
import { eventChannel } from 'redux-saga';
import { call, fork, put, take, takeEvery } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import {
  sessionActionCreators,
  sessionAsyncActionCreators
} from '../actions/session';
import { userCollectionActionCreator } from '../actions/user';
import { getFirestore, initializeFirebase } from '../services/session';

const logoutWorker = bindAsyncAction(sessionAsyncActionCreators.logout)(
  function*() {
    const auth = firebase.auth();
    yield call(auth.signOut.bind(auth));
  }
);

const watchAuthStateChanged = () => {
  return eventChannel(emitter => {
    firebase.auth().onAuthStateChanged(firebaseUser => {
      emitter(firebaseUser);
    });
    return () => {}; // tslint:disable-line
  });
};

export function* saga() {
  const chan = yield call(watchAuthStateChanged);
  try {
    while (true) {
      const firebaseUser: firebase.User = yield take(chan);
      yield put(sessionActionCreators.login(firebaseUser));
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
  watchRequestToLogout(),
  (function*() {
    yield takeEvery(sessionActionCreators.login.type, function*(
      action: Action<firebase.User>
    ) {
      const firebaseUser = action.payload;
      if (firebaseUser) {
        const docRef = getFirestore()
          .collection('users')
          .doc(firebaseUser.uid);
        const userSnapshot = yield call(docRef.get.bind(docRef));
        const existUser = userSnapshot.exists ? userSnapshot.data() : {};
        const user = {
          displayName: firebaseUser.displayName
            ? firebaseUser.displayName
            : undefined,
          id: firebaseUser.uid,
          photoURL: firebaseUser.photoURL ? firebaseUser.photoURL : undefined,
          ...existUser
        };
        if (!userSnapshot.exists || !_.isEqual(existUser, user)) {
          yield put(
            userCollectionActionCreator.modify.started({
              doc: user,
              selectorParam: {}
            })
          );
        }
        yield put(sessionActionCreators.updateUser({ user }));
      }
    });
  })()
];

function* initializeFirebaseWorkerWrapper() {
  initializeFirebase();
  yield put(sessionActionCreators.finishFirebaseInitializing());
  yield fork(saga);
}

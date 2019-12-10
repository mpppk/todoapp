import firebase from 'firebase';
import { eventChannel } from 'redux-saga';
import { call, fork, put, take, takeEvery } from 'redux-saga/effects';
import { Action } from 'typescript-fsa';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import {
  sessionActionCreators,
  sessionAsyncActionCreators,
  UpdateUserPayload
} from '../actions/session';
import { User } from '../reducers/reducer';
import {
  fromFirebaseUserToUser,
  getFirestore,
  initializeFirebase
} from '../services/session';

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

function* updateUserWorker(user: User) {
  const doc = getFirestore()
    .collection('users')
    .doc(user.id);
  const docSnapshot = yield call(doc.get.bind(doc));
  if (!docSnapshot.exists) {
    yield call(doc.set.bind(doc), user);
  }
}

export const sessionWatchers = [
  watchRequestToInitializeFirebase(),
  watchRequestToLogout(),
  (function*() {
    yield takeEvery(sessionActionCreators.updateUser.type, function*(
      action: Action<UpdateUserPayload>
    ) {
      if (action.payload.user) {
        yield updateUserWorker(action.payload.user);
      }
    });
  })()
];

function* initializeFirebaseWorkerWrapper() {
  initializeFirebase();
  yield put(sessionActionCreators.finishFirebaseInitializing());
  yield fork(saga);
}

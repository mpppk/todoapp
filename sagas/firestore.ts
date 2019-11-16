import { call, put, take, takeEvery } from '@redux-saga/core/effects';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { eventChannel } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import {
  firestoreActionCreators,
  firestoreAsyncActionCreators
} from '../actions/firestore';
import { ITask } from '../domain/todo';

function* querySnapshotChannel(firestore: firebase.firestore.Firestore) {
  return eventChannel(emit => {
    const query = firestore.collection('tasks');
    query.onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => {
      emit(snapshot.docChanges());
    });

    const unsubscribe = query.onSnapshot(() => {
      /****/
    });
    return () => unsubscribe();
  });
}

export function* watchQuerySnapShot() {
  const chan = yield call(querySnapshotChannel, firebase.firestore());
  try {
    while (true) {
      const docChanges: firebase.firestore.DocumentChange[] = yield take(chan);
      const addedTasks = docChanges
        .filter(d => d.type === 'added')
        .map(d => d.doc.data() as ITask);
      const removedTasks = docChanges
        .filter(d => d.type === 'removed')
        .map(d => d.doc.data() as ITask);
      const modifiedTasks = docChanges
        .filter(d => d.type === 'modified')
        .map(d => d.doc.data() as ITask);

      if (addedTasks.length !== 0) {
        yield put(firestoreActionCreators.addedTasks(addedTasks));
      }
      if (removedTasks.length !== 0) {
        yield put(firestoreActionCreators.removedTasks(removedTasks));
      }
      if (modifiedTasks.length !== 0) {
        yield put(firestoreActionCreators.modifiedTasks(modifiedTasks));
      }
    }
  } finally {
  } // tslint:disable-line
}

const addTaskWorker = bindAsyncAction(firestoreAsyncActionCreators.addTask, {
  skipStartedAction: true
})(function*(task: ITask) {
  const collection = firebase.firestore().collection('tasks');
  return yield call(collection.add.bind(collection), task);
});

function* watchAddTask() {
  function* worker(action: Action<ITask>) {
    yield addTaskWorker(action.payload);
  }

  yield takeEvery(firestoreAsyncActionCreators.addTask.started.type, worker);
}

export const firestoreWatchers = [watchAddTask()];

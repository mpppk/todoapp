import { call, put, take, takeEvery } from '@redux-saga/core/effects';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { eventChannel } from 'redux-saga';
import { Action, AsyncActionCreators } from 'typescript-fsa';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import {
  firestoreActionCreators,
  firestoreAsyncActionCreators
} from '../actions/firestore';
import { ITask, ITaskDraft } from '../domain/todo';

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
    const docChangeToTask = (d: firebase.firestore.DocumentChange): ITask => {
      return { id: d.doc.id, ...d.doc.data() } as ITask;
    };
    while (true) {
      const docChanges: firebase.firestore.DocumentChange[] = yield take(chan);
      const addedTasks = docChanges
        .filter(d => d.type === 'added')
        .map(docChangeToTask);
      const removedTasks = docChanges
        .filter(d => d.type === 'removed')
        .map(docChangeToTask);
      const modifiedTasks = docChanges
        .filter(d => d.type === 'modified')
        .map(docChangeToTask);

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

export type DocSelector<Param> = (
  db: firebase.firestore.Firestore,
  param: Param
) => firebase.firestore.DocumentReference;

function* watchAddTask() {
  const addTaskWorker = bindAsyncAction(firestoreAsyncActionCreators.addTask, {
    skipStartedAction: true
  })(function*(task: ITaskDraft) {
    const collection = firebase.firestore().collection('tasks');
    return yield call(collection.add.bind(collection), task);
  });

  function* worker(action: Action<ITaskDraft>) {
    yield addTaskWorker(action.payload);
  }
  yield takeEvery(firestoreAsyncActionCreators.addTask.started.type, worker);
}

export function* watchUpdateDoc<Param, Result, Error>(
  docSelector: DocSelector<Param>,
  asyncActionCreators: AsyncActionCreators<Param, Result, Error>
) {
  const modifyTaskWorker = bindAsyncAction(asyncActionCreators, {
    skipStartedAction: true
  })(function*(param: Param) {
    const db = firebase.firestore();
    const doc = docSelector(db, param);
    return yield call(doc.set.bind(doc), param);
  });

  function* worker(action: Action<Param>) {
    yield modifyTaskWorker(action.payload);
  }

  yield takeEvery(asyncActionCreators.started.type, worker);
}

export function* watchDeleteDoc<Param, Result, Error>(
  docSelector: DocSelector<Param>,
  asyncActionCreators: AsyncActionCreators<Param, Result, Error>
) {
  const deleteDocWorker = bindAsyncAction(asyncActionCreators, {
    skipStartedAction: true
  })(function*(param: Param) {
    const db = firebase.firestore();
    const doc = docSelector(db, param);
    return yield call(doc.delete.bind(doc));
  });

  function* worker(action: Action<Param>) {
    yield deleteDocWorker(action.payload);
  }

  yield takeEvery(asyncActionCreators.started.type, worker);
}

export const firestoreWatchers = [watchAddTask()];

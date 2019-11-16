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
import { ITask, ITaskDraft, TaskID, toDraft } from '../domain/todo';

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

function* watchEditTask() {
  const editTaskWorker = bindAsyncAction(
    firestoreAsyncActionCreators.editTask,
    {
      skipStartedAction: true
    }
  )(function*(task: ITask) {
    const doc = firebase
      .firestore()
      .collection('tasks')
      .doc(task.id);
    return yield call(doc.set.bind(doc), toDraft(task));
  });

  function* worker(action: Action<ITask>) {
    yield editTaskWorker(action.payload);
  }

  yield takeEvery(firestoreAsyncActionCreators.editTask.started.type, worker);
}

function* watchDeleteTask() {
  const deleteTaskWorker = bindAsyncAction(
    firestoreAsyncActionCreators.deleteTask,
    {
      skipStartedAction: true
    }
  )(function*(task: TaskID) {
    const doc = firebase
      .firestore()
      .collection('tasks')
      .doc(task.id);
    return yield call(doc.delete.bind(doc));
  });

  function* worker(action: Action<TaskID>) {
    yield deleteTaskWorker(action.payload);
  }

  yield takeEvery(firestoreAsyncActionCreators.deleteTask.started.type, worker);
}

export const firestoreWatchers = [
  watchAddTask(),
  watchEditTask(),
  watchDeleteTask()
];

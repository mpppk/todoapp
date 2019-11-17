import { put, takeEvery } from '@redux-saga/core/effects';
import { Action } from 'typescript-fsa';
import { firestoreAsyncActionCreators } from '../actions/firestore';
import { todoActionCreators } from '../actions/todo';
import { ITask, ITaskDraft } from '../domain/todo';
import { IAddDocParam } from './firestore';

function* watchClickNewTaskButton() {
  function* worker(action: Action<ITaskDraft>) {
    const param: IAddDocParam<ITaskDraft> = {
      doc: action.payload,
      selectorParam: action.payload
    };
    yield put(firestoreAsyncActionCreators.addTask.started(param));
  }

  yield takeEvery(todoActionCreators.clickNewTaskButton.type, worker);
}

function* watchClickUpdateTaskButton() {
  function* worker(action: Action<ITask>) {
    const task = action.payload;
    const param = {
      doc: task,
      selectorParam: task
    };
    yield put(firestoreAsyncActionCreators.modifyTask.started(param));
  }

  yield takeEvery(todoActionCreators.clickUpdateTaskButton.type, worker);
}

function* watchClickDeleteTaskButton() {
  function* worker(action: Action<ITask>) {
    yield put(firestoreAsyncActionCreators.deleteTask.started(action.payload));
  }

  yield takeEvery(todoActionCreators.clickDeleteTaskButton.type, worker);
}

export const todoWatchers = [
  watchClickNewTaskButton(),
  watchClickUpdateTaskButton(),
  watchClickDeleteTaskButton()
];

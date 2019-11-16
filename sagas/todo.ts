import { put, takeEvery } from '@redux-saga/core/effects';
import { Action } from 'typescript-fsa';
import { firestoreAsyncActionCreators } from '../actions/firestore';
import { todoActionCreators } from '../actions/todo';
import { ITask, ITaskDraft } from '../domain/todo';

function* watchClickNewTaskButton() {
  function* worker(action: Action<ITaskDraft>) {
    yield put(firestoreAsyncActionCreators.addTask.started(action.payload));
  }
  yield takeEvery(todoActionCreators.clickNewTaskButton.type, worker);
}

function* watchClickEditTaskButton() {
  function* worker(action: Action<ITask>) {
    yield put(firestoreAsyncActionCreators.editTask.started(action.payload));
  }
  yield takeEvery(todoActionCreators.clickEditTaskButton.type, worker);
}

function* watchClickDeleteTaskButton() {
  function* worker(action: Action<ITask>) {
    yield put(firestoreAsyncActionCreators.deleteTask.started(action.payload));
  }
  yield takeEvery(todoActionCreators.clickDeleteTaskButton.type, worker);
}

export const todoWatchers = [
  watchClickNewTaskButton(),
  watchClickEditTaskButton(),
  watchClickDeleteTaskButton()
];

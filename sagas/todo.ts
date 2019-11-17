import { put, takeEvery } from '@redux-saga/core/effects';
import { Action } from 'typescript-fsa';
import {
  taskCollectionActionCreator,
  todoActionCreators
} from '../actions/todo';
import { Task, TaskDraft } from '../domain/todo';
import { AddDocParam } from './firestore';

function* watchClickNewTaskButton() {
  function* worker(action: Action<TaskDraft>) {
    const param: AddDocParam<TaskDraft> = {
      doc: action.payload,
      selectorParam: action.payload
    };
    yield put(taskCollectionActionCreator.add.started(param));
  }

  yield takeEvery(todoActionCreators.clickNewTaskButton.type, worker);
}

function* watchClickUpdateTaskButton() {
  function* worker(action: Action<Task>) {
    const task = action.payload;
    const param = {
      doc: task,
      selectorParam: task
    };
    yield put(taskCollectionActionCreator.modify.started(param));
  }

  yield takeEvery(todoActionCreators.clickUpdateTaskButton.type, worker);
}

function* watchClickDeleteTaskButton() {
  function* worker(action: Action<Task>) {
    yield put(taskCollectionActionCreator.remove.started(action.payload));
  }

  yield takeEvery(todoActionCreators.clickDeleteTaskButton.type, worker);
}

export const todoWatchers = [
  watchClickNewTaskButton(),
  watchClickUpdateTaskButton(),
  watchClickDeleteTaskButton()
];

import { put, takeEvery } from '@redux-saga/core/effects';
import { Action } from 'typescript-fsa';
import {
  projectCollectionActionCreator,
  taskCollectionActionCreator,
  todoActionCreators
} from '../actions/todo';
import { Project, Task, TaskDraft } from '../domain/todo';
import { DocParam } from './firestore';

function* watchClickNewTaskButton() {
  function* worker(action: Action<TaskDraft>) {
    const param: DocParam<TaskDraft> = {
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

function* watchClickSaveProjectSettingsButton() {
  function* worker(action: Action<Project>) {
    const project = action.payload;
    const param = {
      doc: project,
      selectorParam: project
    };
    yield put(projectCollectionActionCreator.modify.started(param));
  }

  yield takeEvery(
    todoActionCreators.clickSaveProjectSettingsButton.type,
    worker
  );
}

export const todoWatchers = [
  watchClickNewTaskButton(),
  watchClickUpdateTaskButton(),
  watchClickDeleteTaskButton(),
  watchClickSaveProjectSettingsButton()
];

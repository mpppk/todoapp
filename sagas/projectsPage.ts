import { put, takeEvery } from '@redux-saga/core/effects';
import { Action } from 'typescript-fsa';
import {
  projectCollectionActionCreator,
  todoActionCreators
} from '../actions/todo';
import { Task } from '../domain/todo';

function* watchClickDeleteProjectButton() {
  function* worker(action: Action<Task>) {
    yield put(projectCollectionActionCreator.remove.started(action.payload));
  }

  yield takeEvery(todoActionCreators.clickDeleteProjectButton.type, worker);
}

export const projectPageWatchers = [watchClickDeleteProjectButton()];

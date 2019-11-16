import { put, takeEvery } from '@redux-saga/core/effects';
import { Action } from 'typescript-fsa';
import { firestoreAsyncActionCreators } from '../actions/firestore';
import { todoActionCreators } from '../actions/todo';
import { ITask } from '../domain/todo';

function* watchClickNewTaskButton() {
  function* worker(action: Action<ITask>) {
    yield put(firestoreAsyncActionCreators.addTask.started(action.payload));
  }

  yield takeEvery(todoActionCreators.clickNewTaskButton.type, worker);
}

export const todoWatchers = [watchClickNewTaskButton()];

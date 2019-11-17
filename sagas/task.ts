import { fork, take, takeEvery } from '@redux-saga/core/effects';
import { Action } from 'typescript-fsa';
import { sessionActionCreators } from '../actions/session';
import { taskCollectionActionCreator } from '../actions/todo';
import { bindFireStoreCollection } from './firestore';

export const taskWorkers = bindFireStoreCollection(taskCollectionActionCreator);

function* watchAddDoc() {
  yield takeEvery(
    taskCollectionActionCreator.add.started,
    (action: Action<any>) => taskWorkers.add(action.payload)
  );
}

function* watchModifyDoc() {
  // FIXME
  yield takeEvery(
    taskCollectionActionCreator.modify.started,
    (action: Action<any>) => taskWorkers.modify(action.payload)
  );
}

function* watchRemoveDoc() {
  yield takeEvery(
    taskCollectionActionCreator.remove.started,
    (action: Action<any>) => taskWorkers.remove(action.payload)
  );
}

export function* observe() {
  yield take(sessionActionCreators.finishFirebaseInitializing);
  yield fork(taskWorkers.observe);
}

export const taskWatchers = [
  watchAddDoc(),
  watchModifyDoc(),
  watchRemoveDoc(),
  observe()
];

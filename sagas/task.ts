import { takeEvery } from '@redux-saga/core/effects';
import { Action } from 'typescript-fsa';
import { taskCollectionActionCreator } from '../actions/todo';
import { bindFireStoreCollection } from './firestore';

export const taskWorkers = bindFireStoreCollection(taskCollectionActionCreator);

export function* watchAddDoc() {
  // FIXME
  yield takeEvery(
    taskCollectionActionCreator.add.started,
    (action: Action<any>) => taskWorkers.add(action.payload)
  );
}

export function* watchModifyDoc() {
  // FIXME
  yield takeEvery(
    taskCollectionActionCreator.modify.started,
    (action: Action<any>) => taskWorkers.modify(action.payload)
  );
}

export function* watchRemoveDoc() {
  // FIXME
  yield takeEvery(
    taskCollectionActionCreator.remove.started,
    (action: Action<any>) => taskWorkers.remove(action.payload)
  );
}

export const taskWatchers = [watchAddDoc(), watchModifyDoc(), watchRemoveDoc()];

import { put, takeEvery } from '@redux-saga/core/effects';
import { Action } from 'typescript-fsa';
import { projectsNewPageActionCreators } from '../actions/pages/projectsNew';
import {
  projectCollectionActionCreator,
  todoActionCreators
} from '../actions/todo';
import { ProjectDraft, Task } from '../domain/todo';

function* watchClickDeleteProjectButton() {
  function* worker(action: Action<Task>) {
    yield put(projectCollectionActionCreator.remove.started(action.payload));
  }

  yield takeEvery(todoActionCreators.clickDeleteProjectButton.type, worker);
}

function* watchClickCreateProjectButton() {
  function* worker(action: Action<ProjectDraft>) {
    yield put(
      projectCollectionActionCreator.add.started({
        doc: action.payload,
        selectorParam: {}
      })
    );
  }

  yield takeEvery(
    projectsNewPageActionCreators.clickCreateProjectButton.type,
    worker
  );
}

export const projectPageWatchers = [
  watchClickDeleteProjectButton(),
  watchClickCreateProjectButton()
];

import { put, takeEvery } from '@redux-saga/core/effects';
import { Action } from 'typescript-fsa';
import { projectsNewPageActionCreators } from '../actions/pages/projectsNew';
import {
  projectCollectionActionCreator,
  todoActionCreators
} from '../actions/todo';
import { Project, ProjectDraft } from '../domain/todo';

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

function* watchClickEditProjectButton() {
  function* worker(action: Action<Project>) {
    yield put(
      projectCollectionActionCreator.modify.started({
        doc: action.payload,
        selectorParam: {}
      })
    );
  }

  yield takeEvery(todoActionCreators.clickEditProjectButton.type, worker);
}

function* watchClickDeleteProjectButton() {
  function* worker(action: Action<Project>) {
    yield put(projectCollectionActionCreator.remove.started(action.payload));
  }

  yield takeEvery(todoActionCreators.clickDeleteProjectButton.type, worker);
}

export const projectPageWatchers = [
  watchClickCreateProjectButton(),
  watchClickEditProjectButton(),
  watchClickDeleteProjectButton()
];

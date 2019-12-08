import { delay, put, takeLatest } from '@redux-saga/core/effects';
import { Action } from 'typescript-fsa';
import { todoActionCreators } from '../actions/todo';
import { userCollectionQueryActionCreators } from '../actions/user';
import { minSearchTextLength, searchThrottlingMs } from '../core/config';

function* watchChangeUserNameInput() {
  function* worker(action: Action<string>) {
    const searchText = action.payload;
    if (searchText.length < minSearchTextLength) {
      return;
    }
    yield delay(searchThrottlingMs);
    yield put(
      userCollectionQueryActionCreators.searchProjectMemberCandidate.started(
        searchText
      )
    );
  }

  yield takeLatest(
    todoActionCreators.changeNewMemberSearchUserNameInput,
    worker
  );
}

export const projectsSettingsPageWatchers = [watchChangeUserNameInput()];

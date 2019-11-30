import { all } from '@redux-saga/core/effects';
import { projectWatchers } from './projects';
import { projectPageWatchers } from './projectsPage';
import { sessionWatchers } from './session';
import { taskWatchers } from './task';
import { todoWatchers } from './todo';

export default function* rootSaga() {
  yield all([
    ...sessionWatchers,
    ...todoWatchers,
    ...taskWatchers,
    ...projectWatchers,
    ...projectPageWatchers
  ]);
}

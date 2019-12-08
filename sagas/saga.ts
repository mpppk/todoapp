import { all } from '@redux-saga/core/effects';
import { projectWatchers } from './projects';
import { projectPageWatchers } from './projectsPage';
import { projectsSettingsPageWatchers } from './projectsSettingsPage';
import { sessionWatchers } from './session';
import { taskWatchers } from './task';
import { todoWatchers } from './todo';
import { userWatchers } from './user';

export default function* rootSaga() {
  yield all([
    ...sessionWatchers,
    ...todoWatchers,
    ...taskWatchers,
    ...projectWatchers,
    ...userWatchers,
    ...projectPageWatchers,
    ...projectsSettingsPageWatchers
  ]);
}

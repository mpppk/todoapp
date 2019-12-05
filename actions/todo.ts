import actionCreatorFactory from 'typescript-fsa';
import { Project, Task, TaskDraft } from '../domain/todo';
import { firebaseActionCreatorFactory } from './firestore';

const todoActionCreatorFactory = actionCreatorFactory('TODO');

export const todoActionCreators = {
  clickCloseTaskButton: todoActionCreatorFactory<Task>(
    'CLICK_CLOSE_TASK_BUTTON'
  ),
  clickDeleteProjectButton: todoActionCreatorFactory<Project>(
    'CLICK_DELETE_PROJECT_BUTTON'
  ),
  clickDeleteTaskButton: todoActionCreatorFactory<Task>(
    'CLICK_DELETE_TASK_BUTTON'
  ),
  clickEditProjectButton: todoActionCreatorFactory<Project>(
    'CLICK_EDIT_PROJECT_BUTTON'
  ),
  clickEditTaskButton: todoActionCreatorFactory<Task>('CLICK_EDIT_TASK_BUTTON'),
  clickNewProjectButton: todoActionCreatorFactory('CLICK_NEW_PROJECT_BUTTON'),
  clickNewTaskButton: todoActionCreatorFactory<TaskDraft>(
    'CLICK_NEW_TASK_BUTTON'
  ),
  clickProject: todoActionCreatorFactory<Project>('CLICK_PROJECT'),
  clickSaveProjectSettingsButton: todoActionCreatorFactory<Project>(
    'CLICK_SAVE_PROJECT_SETTINGS_BUTTON'
  ),
  clickUpdateTaskButton: todoActionCreatorFactory<Task>(
    'CLICK_UPDATE_TASK_BUTTON'
  )
};

const fbFactory = firebaseActionCreatorFactory('FIREBASE');
export const projectCollectionActionCreator = fbFactory.firestore.collection<
  Project
>('projects');
export const taskCollectionActionCreator = fbFactory.firestore.collection<Task>(
  'projects/{projectId}/tasks'
);

import actionCreatorFactory from 'typescript-fsa';
import { ITask, ITaskDraft } from '../domain/todo';
import { firebaseActionCreatorFactory } from './firestore';

const todoActionCreatorFactory = actionCreatorFactory('TODO');

export const todoActionCreators = {
  clickCloseTaskButton: todoActionCreatorFactory<ITask>(
    'CLICK_CLOSE_TASK_BUTTON'
  ),
  clickDeleteTaskButton: todoActionCreatorFactory<ITask>(
    'CLICK_DELETE_TASK_BUTTON'
  ),
  clickEditTaskButton: todoActionCreatorFactory<ITask>(
    'CLICK_EDIT_TASK_BUTTON'
  ),
  clickNewTaskButton: todoActionCreatorFactory<ITaskDraft>(
    'CLICK_NEW_TASK_BUTTON'
  ),
  clickUpdateTaskButton: todoActionCreatorFactory<ITask>(
    'CLICK_UPDATE_TASK_BUTTON'
  )
};

const todoCollectionActionCreatorFactory = firebaseActionCreatorFactory(
  'FIREBASE'
);
export const taskCollectionActionCreator = todoCollectionActionCreatorFactory.firestore.collection<
  ITask
>('tasks');

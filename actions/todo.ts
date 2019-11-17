import actionCreatorFactory from 'typescript-fsa';
import { Task, TaskDraft } from '../domain/todo';
import { firebaseActionCreatorFactory } from './firestore';

const todoActionCreatorFactory = actionCreatorFactory('TODO');

export const todoActionCreators = {
  clickCloseTaskButton: todoActionCreatorFactory<Task>(
    'CLICK_CLOSE_TASK_BUTTON'
  ),
  clickDeleteTaskButton: todoActionCreatorFactory<Task>(
    'CLICK_DELETE_TASK_BUTTON'
  ),
  clickEditTaskButton: todoActionCreatorFactory<Task>('CLICK_EDIT_TASK_BUTTON'),
  clickNewTaskButton: todoActionCreatorFactory<TaskDraft>(
    'CLICK_NEW_TASK_BUTTON'
  ),
  clickUpdateTaskButton: todoActionCreatorFactory<Task>(
    'CLICK_UPDATE_TASK_BUTTON'
  )
};

const todoCollectionActionCreatorFactory = firebaseActionCreatorFactory(
  'FIREBASE'
);
export const taskCollectionActionCreator = todoCollectionActionCreatorFactory.firestore.collection<
  Task
>('tasks');

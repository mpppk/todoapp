import actionCreatorFactory from 'typescript-fsa';
import { ITask, ITaskDraft } from '../domain/todo';

const todoActionCreatorFactory = actionCreatorFactory('TODO');

export const todoActionCreators = {
  clickDeleteTaskButton: todoActionCreatorFactory<ITask>(
    'CLICK_DELETE_TASK_BUTTON'
  ),
  clickEditTaskButton: todoActionCreatorFactory<ITask>(
    'CLICK_EDIT_TASK_BUTTON'
  ),
  clickNewTaskButton: todoActionCreatorFactory<ITaskDraft>(
    'CLICK_NEW_TASK_BUTTON'
  )
};

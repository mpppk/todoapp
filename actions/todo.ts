import actionCreatorFactory from 'typescript-fsa';
import { ITask } from '../domain/todo';

const todoActionCreatorFactory = actionCreatorFactory('TODO');

export const todoActionCreators = {
  clickNewTaskButton: todoActionCreatorFactory<ITask>('CLICK_NEW_TASK_BUTTON')
};

import actionCreatorFactory from 'typescript-fsa';

const todoActionCreatorFactory = actionCreatorFactory('TODO');

export const todoActionCreators = {
  clickNewTaskButton: todoActionCreatorFactory<undefined>(
    'CLICK_NEW_TASK_BUTTON'
  )
};

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActionCreators } from '../actions/session';
import { todoActionCreators } from '../actions/todo';
import MyAppBar from '../components/AppBar';
import Page from '../components/Page';
import { ITask, ITaskDraft } from '../domain/todo';
import { State } from '../reducer';

const useHandlers = () => {
  const dispatch = useDispatch();
  return {
    clickDeleteTaskButton: (task: ITask) =>
      dispatch(todoActionCreators.clickDeleteTaskButton(task)),
    clickEditTaskButton: (task: ITask) =>
      dispatch(todoActionCreators.clickEditTaskButton(task)),
    clickNewTaskButton: (task: ITaskDraft) =>
      dispatch(todoActionCreators.clickNewTaskButton(task)),
    requestToInitializeFirebase: () => {
      dispatch(sessionActionCreators.requestToInitializeFirebase());
    },
    requestToLogout: () => dispatch(sessionActionCreators.requestToLogout())
  };
};

const useReduxState = () => {
  const user = useSelector((state: State) => state.user);
  const orgTasks = useSelector((state: State) => state.tasks);
  const tasks = orgTasks ? orgTasks : [];

  return { user, tasks, disableNewTaskButton: !orgTasks };
};

export default () => {
  const handlers = useHandlers();
  const state = useReduxState();

  useEffect(handlers.requestToInitializeFirebase, []);

  return (
    <div>
      <MyAppBar user={state.user} onClickLogout={handlers.requestToLogout} />
      <Page
        user={state.user}
        tasks={state.tasks}
        disableNewTaskButton={state.disableNewTaskButton}
        onClickNewTaskButton={handlers.clickNewTaskButton}
        onClickDeleteButton={handlers.clickDeleteTaskButton}
        onClickEditButton={handlers.clickEditTaskButton}
      />
    </div>
  );
};

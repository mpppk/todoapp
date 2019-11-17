import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActionCreators } from '../actions/session';
import { todoActionCreators } from '../actions/todo';
import MyAppBar from '../components/AppBar';
import Page from '../components/Page';
import { Task, TaskDraft } from '../domain/todo';
import { State } from '../reducer';

const useHandlers = () => {
  const dispatch = useDispatch();
  return {
    clickCloseTaskButton: (task: Task) =>
      dispatch(todoActionCreators.clickCloseTaskButton(task)),
    clickDeleteTaskButton: (task: Task) =>
      dispatch(todoActionCreators.clickDeleteTaskButton(task)),
    clickEditTaskButton: (task: Task) =>
      dispatch(todoActionCreators.clickEditTaskButton(task)),
    clickNewTaskButton: (task: TaskDraft) =>
      dispatch(todoActionCreators.clickNewTaskButton(task)),
    clickUpdateTaskButton: (task: Task) =>
      dispatch(todoActionCreators.clickUpdateTaskButton(task)),
    requestToInitializeFirebase: () => {
      dispatch(sessionActionCreators.requestToInitializeFirebase());
    },
    requestToLogout: () => dispatch(sessionActionCreators.requestToLogout())
  };
};

const useReduxState = () => {
  const user = useSelector((state: State) => state.user);
  const orgTasks = useSelector((state: State) => state.tasks);
  const editTaskId = useSelector((state: State) => state.editTaskId);
  const tasks = orgTasks ? orgTasks : [];

  return { user, tasks, editTaskId, disableNewTaskButton: !orgTasks };
};

export default () => {
  const handlers = useHandlers();
  const state = useReduxState();

  useEffect(handlers.requestToInitializeFirebase, []);

  return (
    <div>
      <MyAppBar user={state.user} onClickLogout={handlers.requestToLogout} />
      <Page
        editTaskId={state.editTaskId}
        user={state.user}
        tasks={state.tasks}
        disableNewTaskButton={state.disableNewTaskButton}
        onClickNewTaskButton={handlers.clickNewTaskButton}
        onClickDeleteTaskButton={handlers.clickDeleteTaskButton}
        onClickEditTaskButton={handlers.clickEditTaskButton}
        onClickCloseTaskButton={handlers.clickCloseTaskButton}
        onClickUpdateTaskButton={handlers.clickUpdateTaskButton}
      />
    </div>
  );
};

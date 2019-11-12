import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActionCreators } from '../actions/session';
import { todoActionCreators } from '../actions/todo';
import MyAppBar from '../components/AppBar';
import Page from '../components/Page';
import { ITask } from '../domain/todo';
import { State } from '../reducer';

const useHandlers = () => {
  const dispatch = useDispatch();
  return {
    clickNewTaskButton: (task: ITask) =>
      dispatch(todoActionCreators.clickNewTaskButton(task)),
    requestToInitializeFirebase: () => {
      dispatch(sessionActionCreators.requestToInitializeFirebase());
    },
    requestToLogout: () => dispatch(sessionActionCreators.requestToLogout())
  };
};

const useReduxState = () => {
  const user = useSelector((state: State) => state.user);
  const tasks = useSelector((state: State) => state.tasks);
  return { user, tasks };
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
        onClickNewTaskButton={handlers.clickNewTaskButton}
      />
    </div>
  );
};

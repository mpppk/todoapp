import { Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActionCreators } from '../../actions/session';
import {
  taskCollectionActionCreator,
  todoActionCreators
} from '../../actions/todo';
import MyAppBar from '../../components/AppBar';
import Page from '../../components/Page';
import { Task, TaskDraft } from '../../domain/todo';
import { State } from '../../reducer';

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
    requestToLogout: () => dispatch(sessionActionCreators.requestToLogout()),
    subscribeTask: (p: { projectId: string }) =>
      dispatch(taskCollectionActionCreator.subscribe(p))
  };
};

const useGlobalState = () => {
  const router = useRouter();
  const id = router.query.id;
  return useSelector((state: State) => {
    const projects = state.projects ? state.projects : [];
    const tasks = state.tasks ? state.tasks : [];
    return {
      disableNewTaskButton: !state.tasks,
      editTaskId: state.editTaskId,
      isReadyFirebase: state.isReadyFirebase,
      project: projects.find(p => p.id === id)!,
      tasks: tasks.filter(t => t.projectId),
      user: state.user
    };
  });
};

export default function Post() {
  const handlers = useHandlers();
  const state = useGlobalState();
  useEffect(handlers.requestToInitializeFirebase, []);
  useEffect(() => {
    handlers.subscribeTask({ projectId: state.project.id });
  }, [state.isReadyFirebase]);

  if (!state.project) {
    return (
      <div>
        <MyAppBar user={state.user} onClickLogout={handlers.requestToLogout} />
        <Typography variant={'h2'}>Project not found</Typography>
      </div>
    );
  }

  return (
    <div>
      <MyAppBar user={state.user} onClickLogout={handlers.requestToLogout} />
      <Typography variant={'h3'}>{state.project.title}</Typography>
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
        projectId={state.project.id}
      />
    </div>
  );
}

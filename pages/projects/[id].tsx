import { Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActionCreators } from '../../actions/session';
import {
  projectCollectionActionCreator,
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
    subscribeProject: () =>
      dispatch(projectCollectionActionCreator.subscribe.started({})),
    subscribeTask: (p: { projectId: string }) =>
      dispatch(taskCollectionActionCreator.subscribe.started(p))
  };
};

const useGlobalState = () => {
  const router = useRouter();
  const id = router.query.id;
  return useSelector((state: State) => {
    const projects = state.projects ? state.projects : [];
    const project = projects.find(p => p.id === id);
    const tasks =
      state.tasks && project && state.tasks[project.id]
        ? state.tasks[project.id]
        : [];
    return {
      disableNewTaskButton: false, // FIXME: empty collection does not trigger added event
      // disableNewTaskButton: state.tasks === null,
      editTaskId: state.editTaskId,
      isReadyFirebase: state.isReadyFirebase,
      project,
      tasks,
      // tasks: tasks.filter(t => t.projectId),
      user: state.user
    };
  });
};

export default function Post() {
  const handlers = useHandlers();
  const state = useGlobalState();
  useEffect(handlers.requestToInitializeFirebase, []);
  useEffect(() => {
    if (state.isReadyFirebase && state.user) {
      handlers.subscribeProject();
    }
  }, [state.isReadyFirebase, state.user]);
  useEffect(() => {
    if (state.project && state.project.id) {
      handlers.subscribeTask({ projectId: state.project.id });
    }
  }, [state.project]);

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

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActionCreators } from '../actions/session';
import {
  projectCollectionActionCreator,
  todoActionCreators
} from '../actions/todo';
import MyAppBar from '../components/AppBar';
import { Projects } from '../components/todo/Projects';
import { Project } from '../domain/todo';
import { State } from '../reducer';

const useHandlers = () => {
  const dispatch = useDispatch();
  return {
    clickDeleteProjectButton: (project: Project) =>
      dispatch(todoActionCreators.clickDeleteProjectButton(project)),
    clickEditProjectButton: (project: Project) =>
      dispatch(todoActionCreators.clickEditProjectButton(project)),
    clickNewProjectButton: () =>
      dispatch(todoActionCreators.clickNewProjectButton()),
    clickProject: (project: Project) =>
      dispatch(todoActionCreators.clickProject(project)),
    requestToInitializeFirebase: () => {
      dispatch(sessionActionCreators.requestToInitializeFirebase());
    },
    requestToLogout: () => dispatch(sessionActionCreators.requestToLogout()),
    subscribeProjects: () =>
      dispatch(projectCollectionActionCreator.subscribe.started({})),
    unsubscribeProjects: () => {
      dispatch(projectCollectionActionCreator.unsubscribe.started({}));
    }
  };
};

const selector = (state: State) => {
  const global = state.global;
  return {
    isReadyFirebase: global.isReadyFirebase,
    projects: global.projects ? global.projects : [],
    user: global.user
  };
};

export default () => {
  const handlers = useHandlers();
  const state = useSelector(selector);

  useEffect(handlers.requestToInitializeFirebase, []);
  useEffect(() => {
    if (state.isReadyFirebase && state.user) {
      handlers.subscribeProjects();
      return handlers.unsubscribeProjects;
    }
  }, [state.isReadyFirebase, state.user]);

  return (
    <div>
      <MyAppBar user={state.user} onClickLogout={handlers.requestToLogout} />
      <Projects
        onClickDeleteProjectButton={handlers.clickDeleteProjectButton}
        onClickEditProjectButton={handlers.clickEditProjectButton}
        onClickProject={handlers.clickProject}
        projects={state.projects}
      />
    </div>
  );
};

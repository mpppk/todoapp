import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActionCreators } from '../actions/session';
import { todoActionCreators } from '../actions/todo';
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
    clickProject: (project: Project) =>
      dispatch(todoActionCreators.clickProject(project)),
    requestToInitializeFirebase: () => {
      dispatch(sessionActionCreators.requestToInitializeFirebase());
    },
    requestToLogout: () => dispatch(sessionActionCreators.requestToLogout())
  };
};

const selector = (state: State) => {
  return {
    isReadyFirebase: state.isReadyFirebase,
    projects: state.projects ? state.projects : [],
    user: state.user
  };
};

export default () => {
  const handlers = useHandlers();
  const state = useSelector(selector);

  useEffect(handlers.requestToInitializeFirebase, []);

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

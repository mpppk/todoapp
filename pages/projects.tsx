import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActionCreators } from '../actions/session';
import MyAppBar from '../components/AppBar';
import { State } from '../reducer';

const useHandlers = () => {
  const dispatch = useDispatch();
  return {
    requestToInitializeFirebase: () => {
      dispatch(sessionActionCreators.requestToInitializeFirebase());
    },
    requestToLogout: () => dispatch(sessionActionCreators.requestToLogout())
  };
};

const useReduxState = () => {
  const user = useSelector((state: State) => state.user);
  const isReadyFirebase = useSelector((state: State) => state.isReadyFirebase);
  return { user, isReadyFirebase };
};

export default () => {
  const handlers = useHandlers();
  const state = useReduxState();

  useEffect(handlers.requestToInitializeFirebase, []);
  // useEffect(() => {
  //   if (state.isReadyFirebase) {
  //     handlers.subscribeProjects();
  //   }
  // }, [state.isReadyFirebase]);

  return (
    <div>
      <MyAppBar user={state.user} onClickLogout={handlers.requestToLogout} />
    </div>
  );
};

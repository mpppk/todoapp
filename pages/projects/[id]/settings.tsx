import { createStyles, Theme, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sessionActionCreators } from '../../../actions/session';
import {
  projectCollectionActionCreator,
  todoActionCreators
} from '../../../actions/todo';
import MyAppBar from '../../../components/AppBar';
import { ChangeEvent, EventHandler } from '../../../core/events';
import { Project } from '../../../domain/todo';
import { State } from '../../../reducer';

const useHandlers = () => {
  const dispatch = useDispatch();
  return {
    clickSaveProjectSettingsButton: (project: Project) => {
      dispatch(todoActionCreators.clickSaveProjectSettingsButton(project));
    },
    requestToInitializeFirebase: () => {
      dispatch(sessionActionCreators.requestToInitializeFirebase());
    },
    requestToLogout: () => dispatch(sessionActionCreators.requestToLogout()),
    subscribeProject: () =>
      dispatch(projectCollectionActionCreator.subscribe.started({}))
  };
};

const useReduxState = () => {
  const router = useRouter();
  const id = router.query.id;
  return useSelector((state: State) => {
    const projects = state.global.projects ? state.global.projects : [];
    const project = projects.find(p => p.id === id);
    return {
      isReadyFirebase: state.global.isReadyFirebase,
      project,
      user: state.global.user
    };
  });
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    control: {
      padding: theme.spacing(2)
    },
    paper: {
      height: 140,
      width: 100
    },
    root: {
      flexGrow: 1,
      margin: 5
    }
  })
);

export default () => {
  const classes = useStyles();
  const handlers = useHandlers();
  const state = useReduxState();
  const router = useRouter();

  const handleClickSaveProjectSettingsButton = () => {
    if (state.user === null) {
      // tslint:disable-next-line no-console
      console.warn('project will not be created because user is undefined');
      return;
    }
    if (!state.project) {
      // tslint:disable-next-line no-console
      console.warn('project will not be created because user is undefined');
      return;
    }
    handlers.clickSaveProjectSettingsButton({
      ...state.project,
      description,
      title
    });
    router.push('/projects/[id]', `/projects/${state.project.id}`);
  };

  useEffect(handlers.requestToInitializeFirebase, []);
  useEffect(() => {
    if (state.isReadyFirebase && state.user) {
      handlers.subscribeProject();
    }
  }, [state.isReadyFirebase, state.user]);

  const [title, setTitle] = useState(state.project ? state.project.title : '');
  const [description, setDescription] = useState(
    state.project ? state.project.description : ''
  );
  useEffect(() => {
    if (state.isReadyFirebase && state.project) {
      setTitle(state.project.title);
      setDescription(state.project.description);
    }
  }, [state.isReadyFirebase, state.project]);

  const handleChangeTitleInput: EventHandler<ChangeEvent> = e =>
    setTitle(e.target.value);
  const handleChangeDescriptionInput: EventHandler<ChangeEvent> = e =>
    setDescription(e.target.value);

  return (
    <div>
      <MyAppBar user={state.user} onClickLogout={handlers.requestToLogout} />
      <Grid
        container={true}
        spacing={2}
        className={classes.root}
        alignItems={'flex-end'}
      >
        <Grid item={true} xs={12}>
          <Typography variant={'h3'}>Settings</Typography>
        </Grid>
        <Grid item={true}>
          <TextField
            disabled={!state.project}
            label="Project Name"
            variant="outlined"
            value={title}
            onChange={handleChangeTitleInput}
          />
        </Grid>
        <Grid item={true}>
          <TextField
            disabled={!state.project}
            label="Description"
            variant="outlined"
            value={description}
            onChange={handleChangeDescriptionInput}
          />
        </Grid>
        <Grid item={true}>
          <Button
            disabled={!state.project}
            variant={'outlined'}
            color={'primary'}
            onClick={handleClickSaveProjectSettingsButton}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

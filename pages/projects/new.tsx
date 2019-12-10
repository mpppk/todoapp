import { createStyles, Theme, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { projectsNewPageActionCreators } from '../../actions/pages/projectsNew';
import { sessionActionCreators } from '../../actions/session';
import MyAppBar from '../../components/AppBar';
import { ChangeEvent, ClickEvent, EventHandler } from '../../core/events';
import { ProjectDraft } from '../../domain/todo';
import { State } from '../../reducers/reducer';

const useHandlers = () => {
  const dispatch = useDispatch();
  return {
    clickCreateProjectButton: (project: ProjectDraft) => {
      dispatch(projectsNewPageActionCreators.clickCreateProjectButton(project));
    },
    requestToInitializeFirebase: () => {
      dispatch(sessionActionCreators.requestToInitializeFirebase());
    },
    requestToLogout: () => dispatch(sessionActionCreators.requestToLogout())
  };
};

const useReduxState = () => {
  const user = useSelector((state: State) => state.global.user);
  return { user };
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
  const router = useRouter();
  const classes = useStyles();
  const handlers = useHandlers();
  const state = useReduxState();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleChangeTitleInput: EventHandler<ChangeEvent> = e =>
    setTitle(e.target.value);
  const handleChangeDescriptionInput: EventHandler<ChangeEvent> = e =>
    setDescription(e.target.value);

  const handleClickCreateProjectButton = (_e: ClickEvent) => {
    if (state.user === null) {
      // tslint:disable-next-line no-console
      console.warn('project will not be created because user is undefined');
      return;
    }
    handlers.clickCreateProjectButton({
      description,
      members: {
        [state.user.id]: 'projectOwner'
      },
      title
    });
    router.push('/projects');
    setTitle('');
    setDescription('');
  };

  useEffect(handlers.requestToInitializeFirebase, []);

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
          <Typography variant={'h3'}>New Project</Typography>
        </Grid>
        <Grid item={true}>
          <TextField
            required={true}
            label="Project Name"
            variant="outlined"
            onChange={handleChangeTitleInput}
            value={title}
          />
        </Grid>
        <Grid item={true}>
          <TextField
            label="Description"
            variant="outlined"
            onChange={handleChangeDescriptionInput}
            value={description}
          />
        </Grid>
        <Grid item={true}>
          <Button
            variant={'outlined'}
            color={'primary'}
            onClick={handleClickCreateProjectButton}
          >
            Create Project
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

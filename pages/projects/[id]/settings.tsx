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
import { userCollectionActionCreator } from '../../../actions/user';
import AddNewMemberToProjectDialog from '../../../components/AddNewMemberToProjectDialog';
import MyAppBar from '../../../components/AppBar';
import ProjectMemberList from '../../../components/ProjectMemberList';
import { ChangeEvent, EventHandler } from '../../../core/events';
import { Project } from '../../../domain/todo';
import { State, User } from '../../../reducer';
import { FieldValue } from '../../../services/session';

const useHandlers = () => {
  const dispatch = useDispatch();
  return {
    addProjectMember: (user: User, projectId: string) => {
      dispatch(
        projectCollectionActionCreator.modify.started({
          doc: {
            [`members.${user.id}`]: 'projectReader'
          },
          selectorParam: { id: projectId }
        })
      );
    },
    changeUserNameInput: (username: string) => {
      dispatch(todoActionCreators.changeNewMemberSearchUserNameInput(username));
    },
    clickSaveProjectSettingsButton: (project: Project) => {
      dispatch(todoActionCreators.clickSaveProjectSettingsButton(project));
    },
    removeMember: (projectId: string, user: User) => {
      dispatch(
        projectCollectionActionCreator.modify.started({
          doc: {
            [`members.${user.id}`]: FieldValue.delete()
          },
          selectorParam: { id: projectId }
        })
      );
    },
    requestToInitializeFirebase: () => {
      dispatch(sessionActionCreators.requestToInitializeFirebase());
    },
    requestToLogout: () => dispatch(sessionActionCreators.requestToLogout()),
    subscribeProject: () =>
      dispatch(projectCollectionActionCreator.subscribe.started({})),
    subscribeProjectUser: (projectId: string) =>
      dispatch(userCollectionActionCreator.subscribe.started({ projectId })),
    updateMember: (projectId: string, user: User) => {
      dispatch(
        projectCollectionActionCreator.modify.started({
          doc: {
            [`members.${user.id}`]: 'projectReader' // FIXME
          },
          selectorParam: { id: projectId }
        })
      );
    }
  };
};

const useReduxState = () => {
  const router = useRouter();
  const id = router.query.id;
  return useSelector((state: State) => {
    const projects = state.global.projects ? state.global.projects : [];
    const project = projects.find(p => p.id === id);
    const projectUserIds = state.projectsSettings.users.map(u => u.id);
    const candidateUsers = state.projectsSettings.candidateUsers.filter(
      user => !projectUserIds.includes(user.id)
    );

    return {
      candidateUsers,
      isReadyFirebase: state.global.isReadyFirebase,
      project,
      projectUsers: state.projectsSettings.users,
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
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
      handlers.subscribeProjectUser(state.project.id);
    }
  }, [state.isReadyFirebase, state.project]);

  const handleChangeTitleInput: EventHandler<ChangeEvent> = e =>
    setTitle(e.target.value);
  const handleChangeDescriptionInput: EventHandler<ChangeEvent> = e =>
    setDescription(e.target.value);

  const handleClickAddButton = (user: User) => {
    handlers.addProjectMember(user, state.project!.id);
    handleClose();
  };

  const handleClickEditMemberButton = (user: User) => {
    if (state.project) {
      handlers.updateMember(state.project.id, user);
    }
  };

  const handleClickRemoveMemberButton = (user: User) => {
    if (state.project) {
      handlers.removeMember(state.project.id, user);
    }
  };

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
          <Typography variant={'h4'}>Members</Typography>
          <ProjectMemberList
            users={state.projectUsers}
            onClickEditMemberButton={handleClickEditMemberButton}
            onClickRemoveMemberButton={handleClickRemoveMemberButton}
          />
          <Button
            variant={'outlined'}
            color={'secondary'}
            onClick={handleClickOpen}
          >
            Add new member
          </Button>
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
      <AddNewMemberToProjectDialog
        open={open}
        onChangeUserNameInput={handlers.changeUserNameInput}
        onClose={handleClose}
        users={state.candidateUsers} // FIXME
        onClickAddButton={handleClickAddButton}
      />
    </div>
  );
};

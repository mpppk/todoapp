import { createStyles, Theme, Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from '@material-ui/core/TextField';
import { NextRouter, useRouter } from 'next/router';
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
import ProjectMemberList, {
  ProjectMemberListItemConfig
} from '../../../components/ProjectMemberList';
import { ChangeEvent } from '../../../core/events';
import { Project, ProjectMember, ProjectRole } from '../../../domain/todo';
import { User } from '../../../domain/user';
import { State } from '../../../reducers/reducer';
import { FieldValue } from '../../../services/session';

type GlobalState = ReturnType<typeof useReduxState>;
type ComponentState = ReturnType<typeof useComponentState>;
type GlobalHandlers = ReturnType<typeof useGlobalHandlers>;

const useGlobalHandlers = () => {
  const dispatch = useDispatch();
  return {
    addProjectMember: (user: User, projectId: string, role: ProjectRole) => {
      dispatch(
        projectCollectionActionCreator.modify.started({
          doc: {
            [`members.${user.id}`]: role
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

const useComponentState = (state: GlobalState) => {
  const [open, setOpen] = React.useState(false);
  const [updatingMember, setUpdatingMember] = useState(null as User | null);
  const [title, setTitle] = useState(state.project ? state.project.title : '');
  const [description, setDescription] = useState(
    state.project ? state.project.description : ''
  );
  return {
    open,
    setOpen,
    updatingMember,
    // tslint:disable-next-line:object-literal-sort-keys
    setUpdatingMember,
    title,
    setTitle,
    description,
    setDescription
  };
};

const usePageEffect = (
  state: GlobalState,
  localState: ComponentState,
  handlers: GlobalHandlers
) => {
  useEffect(handlers.requestToInitializeFirebase, []);
  useEffect(() => {
    if (state.isReadyFirebase && state.user) {
      handlers.subscribeProject();
    }
  }, [state.isReadyFirebase, state.user]);

  useEffect(() => {
    if (state.isReadyFirebase && state.project) {
      localState.setTitle(state.project.title);
      localState.setDescription(state.project.description);
      handlers.subscribeProjectUser(state.project.id);
    }
  }, [state.isReadyFirebase, state.project]);

  useEffect(() => {
    if (localState.updatingMember) {
      localState.setUpdatingMember(null);
    }
  }, [state.projectUsers]);
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

const generateComponentHandlers = (
  router: NextRouter,
  globalState: GlobalState,
  componentState: ComponentState,
  handlers: GlobalHandlers
) => {
  const close = () => componentState.setOpen(false);
  return {
    changeDescriptionInput: (e: ChangeEvent) => {
      componentState.setDescription(e.target.value);
    },

    changeTitleInput: (e: ChangeEvent) => {
      componentState.setTitle(e.target.value);
    },

    clickOpen: () => {
      componentState.setOpen(true);
    },

    clickSaveProjectSettingsButton: () => {
      if (globalState.user === null) {
        // tslint:disable-next-line no-console
        console.warn('project will not be created because member is undefined');
        return;
      }
      if (!globalState.project) {
        // tslint:disable-next-line no-console
        console.warn('project will not be created because member is undefined');
        return;
      }
      handlers.clickSaveProjectSettingsButton({
        ...globalState.project,
        description: componentState.description,
        title: componentState.title
      });
      router.push('/projects/[id]', `/projects/${globalState.project.id}`);
    },

    clickAddButton: (user: User, role: ProjectRole) => {
      componentState.setUpdatingMember(user);
      handlers.addProjectMember(user, globalState.project!.id, role);
      close();
    },

    clickEditMemberButton: (user: User) => {
      if (globalState.project) {
        handlers.updateMember(globalState.project.id, user);
      }
    },
    clickRemoveMemberButton: (user: User) => {
      if (globalState.project) {
        componentState.setUpdatingMember(user);
        handlers.removeMember(globalState.project.id, user);
      }
    },
    close
  };
};

const generateViewState = (
  globalState: GlobalState,
  componentState: ComponentState
) => {
  let projectUsers = globalState.projectUsers;
  if (componentState.updatingMember) {
    projectUsers = projectUsers.filter(
      u => u.id !== componentState.updatingMember!.id
    );
  }
  let members: ProjectMember[] = [];
  if (globalState.project !== undefined) {
    members = projectUsers.map(user => ({
      role: user.projects[globalState.project!.id],
      user
    }));
  }

  const loginUser = globalState.user;
  let loginMember = undefined as ProjectMember | undefined;
  if (loginUser && globalState.project) {
    loginMember = {
      role: loginUser.projects[globalState.project.id],
      user: loginUser
    };
  }

  const isOwner = (project: Project, user: User) => {
    if (!user.projects) {
      return false;
    }
    return user.projects[project.id] === ('projectOwner' as ProjectRole);
  };

  const shouldDisableMoreButton = (member: ProjectMember) => {
    if (!globalState.project || !loginUser) {
      return true;
    }
    if (isOwner(globalState.project, loginUser)) {
      return false;
    }
    return member.user.id !== loginUser!.id;
  };

  const updatingUser = componentState.updatingMember;
  const memberConfigs: ProjectMemberListItemConfig[] = members.map(member => ({
    disableMoreButton: shouldDisableMoreButton(member),
    isUpdatingUser: !!updatingUser && member.user.id === updatingUser.id,
    member
  }));

  return { memberConfigs, loginMember };
};

export default () => {
  const classes = useStyles();
  const handlers = useGlobalHandlers();
  const globalState = useReduxState();
  const componentState = useComponentState(globalState);
  const router = useRouter();
  usePageEffect(globalState, componentState, handlers);

  const componentHandlers = generateComponentHandlers(
    router,
    globalState,
    componentState,
    handlers
  );
  const viewState = generateViewState(globalState, componentState);

  return (
    <div>
      <MyAppBar
        user={globalState.user}
        onClickLogout={handlers.requestToLogout}
      />
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
            disabled={!globalState.project}
            label="Project Name"
            variant="outlined"
            value={componentState.title}
            onChange={componentHandlers.changeTitleInput}
          />
        </Grid>
        <Grid item={true}>
          <TextField
            disabled={!globalState.project}
            label="Description"
            variant="outlined"
            value={componentState.description}
            onChange={componentHandlers.changeDescriptionInput}
          />
        </Grid>
        <Grid item={true}>
          <Typography variant={'h4'}>Members</Typography>
          <ProjectMemberList
            loginMember={viewState.loginMember}
            memberConfigs={viewState.memberConfigs}
            onClickEditMemberButton={componentHandlers.clickEditMemberButton}
            onClickRemoveMemberButton={
              componentHandlers.clickRemoveMemberButton
            }
          />
          <Button
            disabled={!!componentState.updatingMember}
            variant={'outlined'}
            color={'secondary'}
            onClick={componentHandlers.clickOpen}
          >
            Add new member
          </Button>
        </Grid>
        <Grid item={true}>
          <Button
            disabled={!globalState.project || !!componentState.updatingMember}
            variant={'outlined'}
            color={'primary'}
            onClick={componentHandlers.clickSaveProjectSettingsButton}
          >
            Save
          </Button>
        </Grid>
      </Grid>
      <AddNewMemberToProjectDialog
        open={componentState.open}
        onChangeUserNameInput={handlers.changeUserNameInput}
        onClose={componentHandlers.close}
        users={globalState.candidateUsers} // FIXME
        onClickAddButton={componentHandlers.clickAddButton}
      />
    </div>
  );
};

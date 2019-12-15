import { createStyles, ListItemAvatar, Theme } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';
import MoreHoriz from '@material-ui/icons/MoreHorizOutlined';
import React, { useState } from 'react';
import { User } from '../domain/user';
import { ProjectMemberMenu } from './ProjectMemberMenu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inline: {
      display: 'inline'
    },
    root: {
      backgroundColor: theme.palette.background.paper,
      maxWidth: 360,
      width: '100%'
    }
  })
);

export interface ProjectMemberListProps {
  users: User[];
  updatingUser: User | undefined;
  onClickEditMemberButton: (user: User) => void;
  onClickRemoveMemberButton: (user: User) => void;
}

export interface ProjectMemberListItemProps {
  user: User;
  onClickMoreButton: (e: React.MouseEvent<HTMLElement>, user: User) => void;
}

// tslint:disable-next-line variable-name
const ProjectMemberListItem = (props: ProjectMemberListItemProps) => {
  const handleClickMoreButton = (e: React.MouseEvent<HTMLElement>) => {
    props.onClickMoreButton(e, props.user);
  };

  return (
    <ListItem alignItems="flex-start" button={true}>
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={props.user.photoURL} />
      </ListItemAvatar>
      <ListItemText primary={props.user.displayName} secondary="owner" />
      <ListItemSecondaryAction onClick={handleClickMoreButton}>
        <IconButton>
          <MoreHoriz />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

// tslint:disable-next-line variable-name
const UpdatingProjectMemberListItem = (props: ProjectMemberListItemProps) => {
  const handleClickMoreButton = (e: React.MouseEvent<HTMLElement>) => {
    props.onClickMoreButton(e, props.user);
  };

  return (
    <ListItem alignItems="flex-start" button={true} disabled={true}>
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={props.user.photoURL} />
      </ListItemAvatar>
      <ListItemText primary={props.user.displayName} secondary="updating..." />
      <ListItemSecondaryAction onClick={handleClickMoreButton}>
        <IconButton>
          <MoreHoriz />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default (props: ProjectMemberListProps) => {
  const classes = useStyles();
  const [currentMember, setCurrentMember] = useState(
    undefined as User | undefined
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const setNullAnchorEl = () => setAnchorEl(null);

  const handleClickMoreButton = (
    e: React.MouseEvent<HTMLElement>,
    user: User
  ) => {
    setCurrentMember(user);
    setAnchorEl(e.currentTarget);
  };

  const handleClickRemoveMemberButton = () => {
    if (currentMember) {
      props.onClickRemoveMemberButton(currentMember);
    }
    setNullAnchorEl();
  };

  const handleClickEditMemberButton = () => {
    if (currentMember) {
      props.onClickEditMemberButton(currentMember);
    }
    setNullAnchorEl();
  };

  return (
    <div>
      <List className={classes.root}>
        {props.users.map(user => {
          return (
            <ProjectMemberListItem
              key={'projectMemberListItem_' + user.id}
              user={user}
              onClickMoreButton={handleClickMoreButton}
            />
          );
        })}
        {props.updatingUser ? (
          <UpdatingProjectMemberListItem
            key={'projectMemberListItem_updating_' + props.updatingUser.id}
            user={props.updatingUser}
            onClickMoreButton={handleClickMoreButton}
          />
        ) : null}
      </List>
      <ProjectMemberMenu
        id={`project-member-menu-${currentMember ? currentMember.id : ''}`}
        anchorEl={anchorEl}
        onClose={setNullAnchorEl}
        onClickDelete={handleClickRemoveMemberButton}
        onClickEdit={handleClickEditMemberButton}
      />
    </div>
  );
};

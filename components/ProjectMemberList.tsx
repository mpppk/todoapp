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
import { ProjectMember, toRoleDisplayName } from '../domain/todo';
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
  members: ProjectMember[];
  updatingUser: User | undefined;
  onClickEditMemberButton: (user: User) => void;
  onClickRemoveMemberButton: (user: User) => void;
}

export interface ProjectMemberListItemProps {
  member: ProjectMember;
  onClickMoreButton: (
    e: React.MouseEvent<HTMLElement>,
    member: ProjectMember
  ) => void;
}

export interface UpdatingProjectMemberListItemProps {
  user: User;
}

// tslint:disable-next-line variable-name
const ProjectMemberListItem = (props: ProjectMemberListItemProps) => {
  const handleClickMoreButton = (e: React.MouseEvent<HTMLElement>) => {
    props.onClickMoreButton(e, props.member);
  };
  const roleName = toRoleDisplayName(props.member.role);

  return (
    <ListItem alignItems="flex-start" button={true}>
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={props.member.user.photoURL} />
      </ListItemAvatar>
      <ListItemText
        primary={props.member.user.displayName}
        secondary={roleName}
      />
      <ListItemSecondaryAction onClick={handleClickMoreButton}>
        <IconButton>
          <MoreHoriz />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

// tslint:disable-next-line variable-name
const UpdatingProjectMemberListItem = (
  props: UpdatingProjectMemberListItemProps
) => {
  return (
    <ListItem alignItems="flex-start" button={true} disabled={true}>
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={props.user.photoURL} />
      </ListItemAvatar>
      <ListItemText primary={props.user.displayName} secondary="updating..." />
      <ListItemSecondaryAction>
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
    undefined as ProjectMember | undefined
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const setNullAnchorEl = () => setAnchorEl(null);

  const handleClickMoreButton = (
    e: React.MouseEvent<HTMLElement>,
    member: ProjectMember
  ) => {
    setCurrentMember(member);
    setAnchorEl(e.currentTarget);
  };

  const handleClickRemoveMemberButton = () => {
    if (currentMember) {
      props.onClickRemoveMemberButton(currentMember.user);
    }
    setNullAnchorEl();
  };

  const handleClickEditMemberButton = () => {
    if (currentMember) {
      props.onClickEditMemberButton(currentMember.user);
    }
    setNullAnchorEl();
  };

  return (
    <div>
      <List className={classes.root}>
        {props.members.map(member => {
          return (
            <ProjectMemberListItem
              key={'projectMemberListItem_' + member.user.id}
              member={member}
              onClickMoreButton={handleClickMoreButton}
            />
          );
        })}
        {props.updatingUser ? (
          <UpdatingProjectMemberListItem
            key={'projectMemberListItem_updating_' + props.updatingUser.id}
            user={props.updatingUser}
          />
        ) : null}
      </List>
      <ProjectMemberMenu
        id={`project-member-menu-${currentMember ? currentMember.user.id : ''}`}
        anchorEl={anchorEl}
        onClose={setNullAnchorEl}
        onClickDelete={handleClickRemoveMemberButton}
        onClickEdit={handleClickEditMemberButton}
      />
    </div>
  );
};

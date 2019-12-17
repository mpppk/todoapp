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

export interface ProjectMemberListItemConfig {
  member: ProjectMember;
  disableMoreButton: boolean;
  isUpdatingUser: boolean;
}

export interface ProjectMemberListProps {
  memberConfigs: ProjectMemberListItemConfig[];
  onClickEditMemberButton: (user: User) => void;
  onClickRemoveMemberButton: (user: User) => void;
}

interface ProjectMemberListItemProps {
  member: ProjectMember;
  disableMoreButton: boolean;
  onClickMoreButton: (
    e: React.MouseEvent<HTMLElement>,
    member: ProjectMember
  ) => void;
  updating: boolean;
}

// tslint:disable-next-line variable-name
const ProjectMemberListItem = (props: ProjectMemberListItemProps) => {
  let handleClickMoreButton = (e: React.MouseEvent<HTMLElement>) => {
    props.onClickMoreButton(e, props.member);
  };
  const disableMoreButton = props.disableMoreButton || props.updating;
  if (disableMoreButton) {
    // tslint:disable-next-line
    handleClickMoreButton = () => {};
  }

  const roleName = toRoleDisplayName(props.member.role);
  const secondaryText = props.updating ? 'updating...' : roleName;

  return (
    <ListItem alignItems="flex-start" button={true} disabled={props.updating}>
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={props.member.user.photoURL} />
      </ListItemAvatar>
      <ListItemText
        primary={props.member.user.displayName}
        secondary={secondaryText}
      />
      <ListItemSecondaryAction
        onClick={handleClickMoreButton}
        aria-disabled={disableMoreButton}
      >
        <IconButton disabled={disableMoreButton}>
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
        {props.memberConfigs.map(config => {
          return (
            <ProjectMemberListItem
              disableMoreButton={config.disableMoreButton}
              key={'projectMemberListItem_' + config.member.user.id}
              member={config.member}
              onClickMoreButton={handleClickMoreButton}
              updating={config.isUpdatingUser}
            />
          );
        })}
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

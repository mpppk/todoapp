import { createStyles, ListItemAvatar, Theme } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React from 'react';
import { User } from '../reducer';

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
}

export interface ProjectMemberListItemProps {
  user: User;
}

// tslint:disable-next-line variable-name
const ProjectMemberListItem = (props: ProjectMemberListItemProps) => {
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={props.user.photoURL} />
      </ListItemAvatar>
      <ListItemText primary={props.user.displayName} secondary="owner" />
    </ListItem>
  );
};

export default (props: ProjectMemberListProps) => {
  const classes = useStyles();
  return (
    <div>
      <List className={classes.root}>
        {props.users.map(user => {
          return (
            <ProjectMemberListItem
              key={'projectMemberListItem_' + user.id}
              user={user}
            />
          );
        })}
      </List>
      <Button variant={'outlined'} color={'secondary'}>
        Add new member
      </Button>
    </div>
  );
};

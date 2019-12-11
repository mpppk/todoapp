import { createStyles, ListItemAvatar, Theme } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';
import React, { useEffect, useState } from 'react';
import { ClickEvent } from '../core/events';
import { User } from '../domain/user';

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
  onChangeUser?: (user: User | null) => void;
}

export interface ProjectMemberListItemProps {
  user: User;
  onClick: (e: ClickEvent) => void;
  selected: boolean;
}

// tslint:disable-next-line variable-name
const ProjectMemberListItem = (props: ProjectMemberListItemProps) => {
  return (
    <ListItem
      alignItems="flex-start"
      onClick={props.onClick}
      selected={props.selected}
      button={true}
    >
      <ListItemAvatar>
        <Avatar alt="Remy Sharp" src={props.user.photoURL} />
      </ListItemAvatar>
      <ListItemText primary={props.user.displayName} secondary="owner" />
    </ListItem>
  );
};

export default (props: ProjectMemberListProps) => {
  const classes = useStyles();

  const [selectedIndex, setSelectedIndex] = useState(-1);
  useEffect(() => {
    setSelectedIndex(-1);

    if (props.onChangeUser) {
      props.onChangeUser(null);
    }
  }, [props.users]);

  const generateListItemClickHandler = (user: User, index: number) => {
    return () => {
      setSelectedIndex(index);
      if (props.onChangeUser) {
        props.onChangeUser(user);
      }
    };
  };

  return (
    <List className={classes.root}>
      {props.users.map((user, i) => {
        return (
          <ProjectMemberListItem
            key={'projectMemberListItem_' + user.id}
            onClick={generateListItemClickHandler(user, i)}
            selected={selectedIndex === i}
            user={user}
          />
        );
      })}
    </List>
  );
};

import { Button, Dialog } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { ChangeEvent } from '../core/events';
import { User } from '../domain/user';
import ProjectMemberList from './ProjectMemberList';

interface AddNewMemberToProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onChangeUserNameInput: (username: string) => void;
  onClickAddButton: (user: User) => void;
  users: User[];
}

export default function AddNewMemberToProjectDialog(
  props: AddNewMemberToProjectDialogProps
) {
  const handleChangeUserNameInput = (e: ChangeEvent) => {
    props.onChangeUserNameInput(e.target.value);
  };

  const [currentUser, setCurrentUser] = useState(null as User | null);
  const handleChangeUser = (user: User | null) => {
    setCurrentUser(user);
  };

  const handleClickAddButton = () => {
    if (currentUser !== null) {
      props.onClickAddButton(currentUser);
    }
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Add New Member</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus={true}
          id="name"
          label="user name"
          fullWidth={true}
          variant={'outlined'}
          onChange={handleChangeUserNameInput}
        />
        <ProjectMemberList
          users={props.users}
          onChangeUser={handleChangeUser}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleClickAddButton}
          color="primary"
          disabled={currentUser === null}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

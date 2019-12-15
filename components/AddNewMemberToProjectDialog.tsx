import { Button, Dialog, FormHelperText } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { ChangeEvent, EventHandler } from '../core/events';
import { ProjectRole, toRoleDisplayName } from '../domain/todo';
import { User } from '../domain/user';
import CandidateProjectMemberList from './CandidateProjectMemberList';

interface AddNewMemberToProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onChangeUserNameInput: (username: string) => void;
  onClickAddButton: (user: User, role: ProjectRole) => void;
  users: User[];
}

export default function AddNewMemberToProjectDialog(
  props: AddNewMemberToProjectDialogProps
) {
  const handleChangeUserNameInput = (e: ChangeEvent) => {
    props.onChangeUserNameInput(e.target.value);
  };

  const [currentRole, setCurrentRole] = useState(
    'projectReader' as ProjectRole
  );
  const handleChangeRoleSelect: EventHandler<React.ChangeEvent<{
    name?: string;
    value: unknown;
  }>> = e => setCurrentRole(e.target.value as ProjectRole);

  const [currentUser, setCurrentUser] = useState(null as User | null);
  const handleChangeUser = (user: User | null) => {
    setCurrentUser(user);
  };

  const handleClickAddButton = () => {
    if (currentUser !== null) {
      props.onClickAddButton(currentUser, currentRole);
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
        <CandidateProjectMemberList
          users={props.users}
          onChangeUser={handleChangeUser}
        />
        <FormControl>
          <Select value={currentRole} onChange={handleChangeRoleSelect}>
            <MenuItem value={'projectReader'}>
              {toRoleDisplayName('projectReader')}
            </MenuItem>
            <MenuItem value={'projectWriter'}>
              {toRoleDisplayName('projectWriter')}
            </MenuItem>
            <MenuItem value={'projectOwner'}>
              {toRoleDisplayName('projectOwner')}
            </MenuItem>
          </Select>
          <FormHelperText>Role</FormHelperText>
        </FormControl>
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

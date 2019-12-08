import { Button, Dialog } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { ChangeEvent } from '../core/events';
import { User } from '../reducer';
import ProjectMemberList from './ProjectMemberList';

interface AddNewMemberToProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onChangeUserNameInput: (username: string) => void;
  users: User[];
}

export default function AddNewMemberToProjectDialog(
  props: AddNewMemberToProjectDialogProps
) {
  const handleChangeUserNameInput = (e: ChangeEvent) => {
    props.onChangeUserNameInput(e.target.value);
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
        <ProjectMemberList users={props.users} />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={props.onClose} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

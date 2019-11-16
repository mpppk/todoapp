import { Paper } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import CloseOutline from '@material-ui/icons/CloseOutlined';
import KeyboardReturnOutlined from '@material-ui/icons/KeyboardReturnOutlined';
import React, { MouseEventHandler, useState } from 'react';
import { ChangeEvent, EventHandler } from '../../core/events';
import { ITask } from '../../domain/todo';

interface IWritableTaskProps {
  onClickUpdateButton: (task: ITask) => void;
  onClickCloseButton: (task: ITask) => void;
  id: string;
  title: string;
  description: string;
  isActive: boolean;
}

// tslint:disable-next-line variable-name
export const WritableTask = (props: IWritableTaskProps) => {
  const [title, setTitle] = useState(props.title);
  const [description, setDescription] = useState(props.description);

  const handleChangeTitleInput: EventHandler<ChangeEvent> = e =>
    setTitle(e.target.value);
  const handleChangeDescriptionInput: EventHandler<ChangeEvent> = e =>
    setDescription(e.target.value);

  const handleClickUpdateButton: MouseEventHandler = () => {
    const currentTask: ITask = {
      description,
      id: props.id,
      isActive: props.isActive,
      title
    };
    props.onClickUpdateButton(currentTask);
  };

  const handleClickCloseButton: MouseEventHandler = () => {
    const currentTask: ITask = {
      description,
      id: props.id,
      isActive: props.isActive,
      title
    };
    props.onClickCloseButton(currentTask);
  };

  return (
    <Paper>
      <TextField
        id="standard-basic"
        label="Title"
        margin="normal"
        value={title}
        onChange={handleChangeTitleInput}
      />
      <TextField
        id="standard-basic"
        label="Description"
        margin="normal"
        value={description}
        onChange={handleChangeDescriptionInput}
      />
      <IconButton onClick={handleClickUpdateButton}>
        <KeyboardReturnOutlined />
      </IconButton>
      <IconButton onClick={handleClickCloseButton}>
        <CloseOutline />
      </IconButton>
    </Paper>
  );
};

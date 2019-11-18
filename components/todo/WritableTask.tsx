import { Paper } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import CloseOutline from '@material-ui/icons/CloseOutlined';
import KeyboardReturnOutlined from '@material-ui/icons/KeyboardReturnOutlined';
import React, { MouseEventHandler, useState } from 'react';
import { ChangeEvent, EventHandler } from '../../core/events';
import { Task } from '../../domain/todo';

interface WritableTaskProps {
  onClickUpdateButton: (task: Task) => void;
  onClickCloseButton: (task: Task) => void;
  task: Task;
}

// tslint:disable-next-line variable-name
export const WritableTask = (props: WritableTaskProps) => {
  const [title, setTitle] = useState(props.task.title);
  const [description, setDescription] = useState(props.task.description);

  const handleChangeTitleInput: EventHandler<ChangeEvent> = e =>
    setTitle(e.target.value);
  const handleChangeDescriptionInput: EventHandler<ChangeEvent> = e =>
    setDescription(e.target.value);

  const handleClickUpdateButton: MouseEventHandler = () => {
    const currentTask: Task = {
      ...props.task,
      description,
      title
    };
    props.onClickUpdateButton(currentTask);
  };

  const handleClickCloseButton: MouseEventHandler = () => {
    const currentTask: Task = {
      ...props.task,
      description,
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

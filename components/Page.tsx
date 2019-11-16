import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import * as React from 'react';
import { ChangeEvent, ClickEvent, EventHandler } from '../core/events';
import { ITask, ITaskDraft } from '../domain/todo';
import { IUser } from '../reducer';
import { Task } from './todo/Task';

export interface IPageProps {
  tasks: ITask[];
  user: IUser | null;
  disableNewTaskButton: boolean;
  onClickDeleteButton: (task: ITask) => void;
  onClickEditButton: (task: ITask) => void;
  onClickNewTaskButton: (task: ITaskDraft) => void;
}

export default function Page(props: IPageProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleClickNewTaskButton = (_e: ClickEvent) => {
    props.onClickNewTaskButton({ title, description, isActive: true });
    setTitle('');
    setDescription('');
  };

  const handleChangeTitleInput: EventHandler<ChangeEvent> = e =>
    setTitle(e.target.value);
  const handleChangeDescriptionInput: EventHandler<ChangeEvent> = e =>
    setDescription(e.target.value);

  return (
    <div>
      {props.tasks.map((t, i) => (
        <Task
          key={'task_' + i}
          title={t.title}
          description={t.description}
          id={t.id}
          isActive={true}
          onClickDeleteButton={props.onClickDeleteButton}
          onClickEditButton={props.onClickEditButton}
        />
      ))}
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
        <Button
          disabled={props.disableNewTaskButton}
          variant="outlined"
          onClick={handleClickNewTaskButton}
        >
          Add
        </Button>
      </Paper>
    </div>
  );
}

import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react';
import * as React from 'react';
import { ChangeEvent, ClickEvent, EventHandler } from '../core/events';
import { Task as TaskEntity, TaskDraft } from '../domain/todo';
import { User } from '../reducer';
import { Task } from './todo/Task';
import { WritableTask } from './todo/WritableTask';

export interface PageProps {
  editTaskId: string | null;
  tasks: TaskEntity[];
  user: User | null;
  disableNewTaskButton: boolean;
  onClickDeleteTaskButton: (task: TaskEntity) => void;
  onClickEditTaskButton: (task: TaskEntity) => void;
  onClickNewTaskButton: (task: TaskDraft) => void;
  onClickCloseTaskButton: (task: TaskEntity) => void;
  onClickUpdateTaskButton: (task: TaskEntity) => void;
  projectId: string;
}

export default function Page(props: PageProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleClickNewTaskButton = (_e: ClickEvent) => {
    props.onClickNewTaskButton({
      description,
      isActive: true,
      projectId: props.projectId,
      title
    });
    setTitle('');
    setDescription('');
  };

  const handleChangeTitleInput: EventHandler<ChangeEvent> = e =>
    setTitle(e.target.value);
  const handleChangeDescriptionInput: EventHandler<ChangeEvent> = e =>
    setDescription(e.target.value);

  return (
    <div>
      {props.tasks.map((t, i) =>
        props.editTaskId === t.id ? (
          <WritableTask
            key={'writableTask_' + i}
            onClickCloseButton={props.onClickCloseTaskButton}
            onClickUpdateButton={props.onClickUpdateTaskButton}
            task={t}
          />
        ) : (
          <Task
            key={'task_' + i}
            onClickDeleteButton={props.onClickDeleteTaskButton}
            onClickEditButton={props.onClickEditTaskButton}
            task={t}
          />
        )
      )}
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

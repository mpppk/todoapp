import { Paper } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import React, { MouseEventHandler } from 'react';
import { Task as TaskEntity } from '../../domain/todo';

interface TaskProps {
  onClickDeleteButton: (task: TaskEntity) => void;
  onClickEditButton: (task: TaskEntity) => void;
  task: TaskEntity;
}

// tslint:disable-next-line variable-name
export const Task = (props: TaskProps) => {
  const handleClickEditButton: MouseEventHandler = () => {
    props.onClickEditButton(props.task);
  };

  const handleClickDeleteButton: MouseEventHandler = () => {
    props.onClickDeleteButton(props.task);
  };

  return (
    <Paper>
      <Typography variant="h5" component="h3">
        {props.task.title}
        <IconButton onClick={handleClickEditButton}>
          <Edit />
        </IconButton>
        <IconButton onClick={handleClickDeleteButton}>
          <DeleteOutline />
        </IconButton>
      </Typography>
      {props.task.description}
    </Paper>
  );
};

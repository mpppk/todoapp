import { Paper } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import React, { MouseEventHandler } from 'react';
import { ITask } from '../../domain/todo';

interface ITaskProps {
  onClickDeleteButton: (task: ITask) => void;
  onClickEditButton: (task: ITask) => void;
  id: string;
  title: string;
  description: string;
  isActive: boolean;
}

// tslint:disable-next-line variable-name
export const Task = (props: ITaskProps) => {
  const currentTask: ITask = {
    description: props.description,
    id: props.id,
    isActive: props.isActive,
    title: props.title
  };

  const handleClickEditButton: MouseEventHandler = () => {
    props.onClickEditButton(currentTask);
  };

  const handleClickDeleteButton: MouseEventHandler = () => {
    props.onClickDeleteButton(currentTask);
  };

  return (
    <Paper>
      <Typography variant="h5" component="h3">
        {props.title}
        <IconButton onClick={handleClickEditButton}>
          <Edit />
        </IconButton>
        <IconButton onClick={handleClickDeleteButton}>
          <DeleteOutline />
        </IconButton>
      </Typography>
      {props.description}
    </Paper>
  );
};

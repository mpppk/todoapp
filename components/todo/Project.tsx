import { Paper } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import React, { MouseEventHandler } from 'react';
import { Project as ProjectEntity } from '../../domain/todo';

interface ProjectProps {
  onClick: (project: ProjectEntity) => void;
  onClickDeleteButton: (project: ProjectEntity) => void;
  onClickEditButton: (project: ProjectEntity) => void;
  id: string;
  title: string;
  description: string;
}

// tslint:disable-next-line variable-name
export const Project = (props: ProjectProps) => {
  const currentProject: ProjectEntity = {
    description: props.description,
    id: props.id,
    title: props.title
  };

  const handleClickEditButton: MouseEventHandler = () => {
    props.onClickEditButton(currentProject);
  };

  const handleClickDeleteButton: MouseEventHandler = () => {
    props.onClickDeleteButton(currentProject);
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

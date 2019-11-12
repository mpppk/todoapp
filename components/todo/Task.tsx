import { Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React from 'react';

interface ITaskProps {
  title: string;
  description: string;
  isActive: boolean;
}

// tslint:disable-next-line variable-name
export const Task = (props: ITaskProps) => {
  return (
    <Paper>
      <Typography variant="h5" component="h3">
        {props.title}
      </Typography>
      {props.description}
    </Paper>
  );
};

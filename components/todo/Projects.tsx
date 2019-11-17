import { Paper } from '@material-ui/core';
import React from 'react';
import { IProject } from '../../domain/todo';
import { Project } from './Project';

interface IProjectsProps {
  onClickProject: (project: IProject) => void;
  onClickDeleteProjectButton: (project: IProject) => void;
  onClickEditProjectButton: (project: IProject) => void;
  projects: IProject[];
}

// tslint:disable-next-line variable-name
export const Task = (props: IProjectsProps) => {
  return (
    <Paper>
      {props.projects.map(project => (
        <Project
          key={'project_' + project.id}
          description={project.description}
          id={project.id}
          onClick={props.onClickProject}
          onClickDeleteButton={props.onClickDeleteProjectButton}
          onClickEditButton={props.onClickEditProjectButton}
          title={project.title}
        />
      ))}
    </Paper>
  );
};

import { Paper } from '@material-ui/core';
import React from 'react';
import { Project as ProjectEntity } from '../../domain/todo';
import { Project } from './Project';

interface ProjectsProps {
  onClickProject: (project: ProjectEntity) => void;
  onClickDeleteProjectButton: (project: ProjectEntity) => void;
  onClickEditProjectButton: (project: ProjectEntity) => void;
  projects: ProjectEntity[];
}

// tslint:disable-next-line variable-name
export const Task = (props: ProjectsProps) => {
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

import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MoreHoriz from '@material-ui/icons/MoreHorizOutlined';
import Link from 'next/link';
import { useState } from 'react';
import * as React from 'react';
import { Project, Project as ProjectEntity } from '../../domain/todo';
import { ProjectMenu } from './ProjectMenu';

interface ProjectsProps {
  onClickProject: (project: ProjectEntity) => void;
  onClickDeleteProjectButton: (project: ProjectEntity) => void;
  onClickEditProjectButton: (project: ProjectEntity) => void;
  projects: ProjectEntity[];
}

// tslint:disable-next-line variable-name
export const Projects = (props: ProjectsProps) => {
  const generateClickProjectHandler = (project: Project) => {
    return () => {
      props.onClickProject(project);
    };
  };
  const generateClickEditButtonHandler = (project?: Project) => {
    return () => {
      if (project) {
        props.onClickEditProjectButton(project);
      }
      setNullAnchorEl();
    };
  };
  const generateClickDeleteButtonHandler = (project?: Project) => {
    return () => {
      if (project) {
        props.onClickDeleteProjectButton(project);
      }
      setNullAnchorEl();
    };
  };
  const [currentProject, setCurrentProject] = useState(
    undefined as Project | undefined
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const generateClickMoreButtonHandler = (project: Project) => {
    return (e: React.MouseEvent<HTMLElement>) => {
      setCurrentProject(project);
      setAnchorEl(e.currentTarget);
    };
  };
  const setNullAnchorEl = () => setAnchorEl(null);

  return (
    <Paper>
      <Typography variant={'h3'}>Projects</Typography>
      <List component="nav" aria-label="main mailbox folders">
        {props.projects.map(project => (
          <Link
            key={`project_link_${project.id}`}
            href={'/projects/[id]'}
            as={`/projects/${project.id}`}
          >
            <ListItem
              key={'project_list_' + project.id}
              button={true}
              onClick={generateClickProjectHandler(project)}
            >
              <ListItemText
                primary={project.title}
                secondary={project.description}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={generateClickMoreButtonHandler(project)}>
                  <MoreHoriz />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Link>
        ))}
      </List>
      <ProjectMenu
        id={`project-menu-${currentProject ? currentProject.id : ''}`}
        anchorEl={anchorEl}
        onClose={setNullAnchorEl}
        onClickDelete={generateClickDeleteButtonHandler(currentProject)}
        onClickEdit={generateClickEditButtonHandler(currentProject)}
      />
    </Paper>
  );
};

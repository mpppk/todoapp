import { Button, createStyles, Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import MoreHoriz from '@material-ui/icons/MoreHorizOutlined';
import Link from 'next/link';
import { useState } from 'react';
import * as React from 'react';
import { Project, Project as ProjectEntity } from '../../domain/todo';
import { ProjectMenu } from './ProjectMenu';

interface ProjectsProps {
  onClickProject: (project: ProjectEntity) => void;
  onClickNewProjectButton: () => void;
  onClickDeleteProjectButton: (project: ProjectEntity) => void;
  onClickEditProjectButton: (project: ProjectEntity) => void;
  projects: ProjectEntity[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    control: {
      padding: theme.spacing(2)
    },
    paper: {
      height: 140,
      width: 100
    },
    root: {
      flexGrow: 1
    }
  })
);

// tslint:disable-next-line variable-name
export const Projects = (props: ProjectsProps) => {
  const classes = useStyles();

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
    <Grid
      container={true}
      spacing={2}
      className={classes.root}
      alignItems={'flex-end'}
      justify={'center'}
    >
      <Grid item={true} xs={8}>
        <Typography variant={'h3'}>Projects</Typography>
      </Grid>
      <Grid item={true} xs={4}>
        <Button
          variant={'outlined'}
          color={'primary'}
          onClick={props.onClickNewProjectButton}
        >
          New Project
        </Button>
      </Grid>
      <Grid item={true} xs={12}>
        <List component="nav" aria-label="main mailbox folders">
          {props.projects.map(project => (
            <Link
              href={'/projects/[id]'}
              as={`/projects/${project.id}`}
              key={`project_link_${project.id}`}
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
      </Grid>
      <ProjectMenu
        id={`project-menu-${currentProject ? currentProject.id : ''}`}
        anchorEl={anchorEl}
        onClose={setNullAnchorEl}
        onClickDelete={generateClickDeleteButtonHandler(currentProject)}
        onClickEdit={generateClickEditButtonHandler(currentProject)}
      />
    </Grid>
  );
};

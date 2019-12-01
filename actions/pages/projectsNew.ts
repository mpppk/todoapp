import actionCreatorFactory from 'typescript-fsa';
import { ProjectDraft } from '../../domain/todo';

const projectsNewPageActionCreatorFactory = actionCreatorFactory(
  'PROJECTS_NEW_PAGE'
);

export const projectsNewPageActionCreators = {
  clickCreateProjectButton: projectsNewPageActionCreatorFactory<ProjectDraft>(
    'CLICK_CREATE_PROJECT_BUTTON'
  )
};

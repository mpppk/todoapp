import { reducerWithInitialState } from 'typescript-fsa-reducers';

export const projectsNewState = {
  newProjectKey: null as string | null
};

export type ProjectsNewPageState = typeof projectsNewState;
export const projectsNewReducer = reducerWithInitialState(projectsNewState);

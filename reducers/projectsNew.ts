import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { initialState } from './reducer';

export const projectsNewState = {
  newProjectKey: null as string | null
};

export type ProjectsNewPageState = typeof projectsNewState;
export const projectsNewReducer = reducerWithInitialState(
  initialState.projectsNew
);

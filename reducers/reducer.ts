import { combineReducers } from 'redux';
import { globalReducer, globalState } from './global';
import { projectsNewReducer, projectsNewState } from './projectsNew';
import {
  projectsSettingsReducer,
  projectsSettingsState
} from './projectsSettings';

export const initialState = {
  global: globalState,
  projectsNew: projectsNewState,
  projectsSettings: projectsSettingsState
};

export type State = typeof initialState;

export default combineReducers({
  global: globalReducer,
  projectsNew: projectsNewReducer,
  projectsSettings: projectsSettingsReducer
});

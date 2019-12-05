import { combineReducers } from 'redux';
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { SnapshotEventPayload } from './actions/firestore';
import { sessionActionCreators } from './actions/session';
import {
  projectCollectionActionCreator,
  taskCollectionActionCreator,
  todoActionCreators
} from './actions/todo';
import { Project, Task } from './domain/todo';

interface Tasks {
  [key: string]: Task[];
}

const globalState = {
  editTaskId: null as string | null,
  isReadyFirebase: false,
  projects: null as Project[] | null,
  tasks: null as Tasks | null,
  user: null as User | null
};

export const initialState = {
  global: globalState,
  projectsNew: {
    newProjectKey: null as string | null
  }
};

export interface User {
  displayName?: string;
  email?: string;
  emailVerified: boolean;
  photoURL?: string;
  isAnonymous: boolean;
  phoneNumber: string | null;
  uid: string;
}

export type State = typeof initialState;
export type GlobalState = typeof initialState.global;
export type ProjectsNewPageState = typeof initialState.projectsNew;

const replaceProject = (
  projects: Project[],
  newProject: Project
): Project[] => {
  const index = projects.findIndex(p => p.id === newProject.id);
  if (index !== -1) {
    projects[index] = newProject;
  }
  return projects;
};

const replaceProjects = (
  orgState: GlobalState,
  payload: SnapshotEventPayload<Project>
): GlobalState => {
  const state = { ...orgState };
  if (!state.projects) {
    return state;
  }
  state.projects = payload.docs.reduce(replaceProject, state.projects);
  return state;
};

const replaceTasks = (
  state: GlobalState,
  payload: SnapshotEventPayload<Task>
): GlobalState => {
  const prevTasks: Tasks = state.tasks ? { ...state.tasks } : {};
  const tasks = payload.docs;
  const newTasks = tasks.reduce((acc, task) => {
    const projectTasks = acc[task.projectId] ? acc[task.projectId] : [];
    const index = projectTasks.findIndex(t => t.id === task.id);
    if (index === -1) {
      acc[task.projectId] = [...projectTasks, task];
      return acc;
    }
    projectTasks.splice(index, 1, task);
    acc[task.projectId] = projectTasks;
    return acc;
  }, prevTasks);
  return { ...state, tasks: newTasks };
};

const removeTasks = (
  state: GlobalState,
  payload: SnapshotEventPayload<Task>
): GlobalState => {
  const prevTasks: Tasks = state.tasks ? { ...state.tasks } : {};
  const tasks = payload.docs;
  const newTasks = tasks.reduce((acc, task) => {
    const projectTasks = acc[task.projectId] ? acc[task.projectId] : [];
    const index = projectTasks.findIndex(t => t.id === task.id);
    if (index === -1) {
      return acc;
    }
    projectTasks.splice(index, 1);
    acc[task.projectId] = projectTasks;
    return acc;
  }, prevTasks);
  return { ...state, tasks: newTasks };
};

const updateProjects = (projects: Project[], newProjects: Project[]) => {
  return newProjects.reduce(
    (acc, project) => {
      const index = acc.findIndex(p => p.id === project.id);
      return index === -1 ? [...acc, project] : acc.splice(index, 1, project);
    },
    [...projects]
  );
};

const globalReducer = reducerWithInitialState(initialState.global)
  .case(todoActionCreators.clickEditTaskButton, (state, task) => {
    return { ...state, editTaskId: task.id };
  })
  .case(todoActionCreators.clickUpdateTaskButton, state => {
    return { ...state, editTaskId: null };
  })
  .case(todoActionCreators.clickCloseTaskButton, state => {
    return { ...state, editTaskId: null };
  })
  .case(taskCollectionActionCreator.added, replaceTasks)
  .case(projectCollectionActionCreator.added, (state, payload) => {
    const beforeProjects = state.projects ? state.projects : [];
    return { ...state, projects: updateProjects(beforeProjects, payload.docs) };
  })
  .case(taskCollectionActionCreator.modified, replaceTasks)
  .case(taskCollectionActionCreator.removed, removeTasks)
  .case(projectCollectionActionCreator.modified, replaceProjects)
  .case(projectCollectionActionCreator.removed, (state, payload) => {
    if (state.projects === null) {
      return { ...state };
    }
    const ids = payload.docs.map(doc => doc.id);
    const projects = state.projects.filter(p => !ids.includes(p.id));
    return { ...state, projects };
  })
  .case(sessionActionCreators.finishFirebaseInitializing, state => {
    return { ...state, isReadyFirebase: true };
  })
  .case(sessionActionCreators.updateUser, (state, payload) => {
    return { ...state, user: payload.user };
  });

const projectsNewReducer = reducerWithInitialState(initialState.projectsNew);
export default combineReducers({
  global: globalReducer,
  projectsNew: projectsNewReducer
});

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

export const initialState = {
  editTaskId: null as string | null,
  isReadyFirebase: false,
  projects: null as Project[] | null,
  tasks: null as Tasks | null,
  user: null as User | null
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

const replaceTasks = (
  state: State,
  payload: SnapshotEventPayload<Task>
): State => {
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
  state: State,
  payload: SnapshotEventPayload<Task>
): State => {
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

const reducer = reducerWithInitialState(initialState)
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
  .case(sessionActionCreators.finishFirebaseInitializing, state => {
    return { ...state, isReadyFirebase: true };
  })
  .case(sessionActionCreators.updateUser, (state, payload) => {
    return { ...state, user: payload.user };
  });

export default reducer;

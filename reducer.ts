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
  .case(
    taskCollectionActionCreator.added,
    (state, payload: SnapshotEventPayload<Task>) => {
      const newTasks = payload.docs.reduce((acc, task) => {
        const currentTaskList = acc[task.projectId] ? acc[task.projectId] : [];
        acc[task.projectId] = [...currentTaskList, task];
        return acc;
      }, {} as Tasks);
      const currentTasks = state.tasks ? state.tasks : {};
      return { ...state, tasks: { ...currentTasks, ...newTasks } };
    }
  )
  .case(projectCollectionActionCreator.added, (state, projects) => {
    const beforeProjects = state.projects ? state.projects : [];
    return { ...state, projects: [...beforeProjects, ...projects.docs] };
  })
  .case(taskCollectionActionCreator.modified, (state, payload) => {
    if (!state.tasks) {
      return { ...state };
    }
    const tasks = payload.docs.reduce(
      (acc, task) => {
        const projectTasks = acc[task.projectId] ? acc[task.projectId] : [];
        const index = projectTasks.findIndex(t => t.id === task.id);
        if (index === -1) {
          return acc;
        }
        acc[task.projectId] = projectTasks.splice(index, 1, task);
        return acc;
      },
      { ...state.tasks } as Tasks
    );
    return { ...state, tasks };
  })
  .case(taskCollectionActionCreator.removed, (state, payload) => {
    if (!state.tasks) {
      return { ...state };
    }
    const tasks = payload.docs.reduce(
      (acc, task) => {
        const projectTasks = acc[task.projectId] ? acc[task.projectId] : [];
        const index = projectTasks.findIndex(t => t.id === task.id);
        if (index === -1) {
          return acc;
        }
        acc[task.projectId] = projectTasks.splice(index, 1);
        return acc;
      },
      { ...state.tasks } as Tasks
    );
    return { ...state, tasks };
  })
  .case(sessionActionCreators.finishFirebaseInitializing, state => {
    return { ...state, isReadyFirebase: true };
  })
  .case(sessionActionCreators.updateUser, (state, payload) => {
    return { ...state, user: payload.user };
  });

export default reducer;

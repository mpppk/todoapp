import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { sessionActionCreators } from './actions/session';
import {
  taskCollectionActionCreator,
  todoActionCreators
} from './actions/todo';
import { Task } from './domain/todo';

export const exampleInitialState = {
  editTaskId: null as string | null,
  isReadyFirebase: false,
  tasks: null as Task[] | null,
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

export type State = typeof exampleInitialState;

const reducer = reducerWithInitialState(exampleInitialState)
  .case(todoActionCreators.clickEditTaskButton, (state, task) => {
    return { ...state, editTaskId: task.id };
  })
  .case(todoActionCreators.clickUpdateTaskButton, state => {
    return { ...state, editTaskId: null };
  })
  .case(todoActionCreators.clickCloseTaskButton, state => {
    return { ...state, editTaskId: null };
  })
  .case(taskCollectionActionCreator.added, (state, tasks: Task[]) => {
    const beforeTasks = state.tasks ? state.tasks : [];
    return { ...state, tasks: [...beforeTasks, ...tasks] };
  })
  .case(taskCollectionActionCreator.modified, (state, tasks: Task[]) => {
    const beforeTasks = state.tasks ? state.tasks : [];
    const newTasks = beforeTasks.map(beforeTask => {
      const task = tasks.find(b => b.id === beforeTask.id);
      return task ? task : beforeTask;
    });
    return { ...state, tasks: newTasks };
  })
  .case(taskCollectionActionCreator.removed, (state, tasks: Task[]) => {
    const beforeTasks = state.tasks ? state.tasks : [];
    const newTasks = beforeTasks.filter(bt => !tasks.find(t => bt.id === t.id));
    return { ...state, tasks: newTasks };
  })
  .case(sessionActionCreators.finishFirebaseInitializing, state => {
    return { ...state, isReadyFirebase: true };
  })
  .case(sessionActionCreators.updateUser, (state, payload) => {
    return { ...state, user: payload.user };
  });

export default reducer;

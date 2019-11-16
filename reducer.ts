import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { firestoreActionCreators } from './actions/firestore';
import { sessionActionCreators } from './actions/session';
import { todoActionCreators } from './actions/todo';
import { ITask } from './domain/todo';

export const exampleInitialState = {
  editTaskId: null as string | null,
  isReadyFirebase: false,
  tasks: null as ITask[] | null,
  user: null as IUser | null
};

export interface IUser {
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
  .case(firestoreActionCreators.addedTasks, (state, tasks: ITask[]) => {
    const beforeTasks = state.tasks ? state.tasks : [];
    return { ...state, tasks: [...beforeTasks, ...tasks] };
  })
  .case(firestoreActionCreators.modifiedTasks, (state, tasks: ITask[]) => {
    const beforeTasks = state.tasks ? state.tasks : [];
    const newTasks = beforeTasks.map(beforeTask => {
      const task = tasks.find(b => b.id === beforeTask.id);
      return task ? task : beforeTask;
    });
    return { ...state, tasks: newTasks };
  })
  .case(firestoreActionCreators.removedTasks, (state, tasks: ITask[]) => {
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

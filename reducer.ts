import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { firestoreAsyncActionCreators } from './actions/firestore';
import { sessionActionCreators } from './actions/session';
import { todoActionCreators } from './actions/todo';
import { ITask } from './domain/todo';

export const exampleInitialState = {
  isReadyFirebase: false,
  tasks: [] as ITask[],
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
  .case(firestoreAsyncActionCreators.getTasks.done, (state, payload) => {
    return { ...state, tasks: payload.result };
  })
  .case(sessionActionCreators.finishFirebaseInitializing, state => {
    return { ...state, isReadyFirebase: true };
  })
  .case(sessionActionCreators.updateUser, (state, payload) => {
    return { ...state, user: payload.user };
  })
  .case(todoActionCreators.clickNewTaskButton, (state, task) => {
    return { ...state, tasks: [...state.tasks, task] };
  });

export default reducer;

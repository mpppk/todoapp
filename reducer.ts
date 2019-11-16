import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { firestoreActionCreators } from './actions/firestore';
import { sessionActionCreators } from './actions/session';
import { ITask } from './domain/todo';

export const exampleInitialState = {
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
  .case(firestoreActionCreators.addedTasks, (state, tasks: ITask[]) => {
    const beforeTasks = state.tasks ? state.tasks : [];
    return { ...state, tasks: [...beforeTasks, ...tasks] };
  })
  .case(sessionActionCreators.finishFirebaseInitializing, state => {
    return { ...state, isReadyFirebase: true };
  })
  .case(sessionActionCreators.updateUser, (state, payload) => {
    return { ...state, user: payload.user };
  });

export default reducer;

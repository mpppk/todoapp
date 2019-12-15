import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {
  userCollectionActionCreator,
  userCollectionQueryActionCreators
} from '../actions/user';
import { User } from '../domain/user';
import { removeDocuments, updateDocuments } from '../services/firestore';

export const projectsSettingsState = {
  candidateUsers: [] as User[],
  users: [] as User[]
};
export type ProjectsSettingsPageState = typeof projectsSettingsState;

export const projectsSettingsReducer = reducerWithInitialState(
  projectsSettingsState
)
  .cases(
    [userCollectionActionCreator.added, userCollectionActionCreator.modified],
    (state, payload) => ({
      ...state,
      users: updateDocuments(state.users, payload.docs)
    })
  )
  .case(userCollectionActionCreator.removed, (state, payload) => ({
    ...state,
    users: removeDocuments(state.users, payload.docs)
  }))
  .case(
    userCollectionQueryActionCreators.searchProjectMemberCandidate.done,
    (state, payload) => {
      const candidateUsers = payload.result.docs.map((doc: any) => doc.data());
      return { ...state, candidateUsers };
    }
  );

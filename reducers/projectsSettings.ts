import { reducerWithInitialState } from 'typescript-fsa-reducers';
import { SnapshotEventPayload } from '../actions/firestore';
import {
  userCollectionActionCreator,
  userCollectionQueryActionCreators
} from '../actions/user';
import { User } from '../domain/user';
import { compareById } from '../services/util';
import { initialState } from './reducer';

export const projectsSettingsState = {
  candidateUsers: [] as User[],
  users: [] as User[]
};
export type ProjectsSettingsPageState = typeof projectsSettingsState;

const replaceUsers = (
  state: ProjectsSettingsPageState,
  payload: SnapshotEventPayload<User>
): ProjectsSettingsPageState => {
  const prevUsers = state.users;
  const newUsers = payload.docs;
  const filteredUsers = prevUsers.filter(
    pu => !newUsers.map(u => u.id).includes(pu.id)
  );
  const users = [...filteredUsers, ...newUsers].sort(compareById);
  return { ...state, users };
};

export const projectsSettingsReducer = reducerWithInitialState(
  initialState.projectsSettings
)
  .case(userCollectionActionCreator.added, replaceUsers)
  .case(
    userCollectionQueryActionCreators.searchProjectMemberCandidate.done,
    (state, payload) => {
      const candidateUsers = payload.result.docs.map((doc: any) => doc.data());
      return { ...state, candidateUsers };
    }
  );

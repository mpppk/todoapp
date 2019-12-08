import { User } from '../reducer';
import { CollectionQueryActionCreators } from './firestore';
import { fbFactory } from './todo';

const factory = fbFactory.firestore.collection<User>('users');

export const userCollectionQueryActionCreators: CollectionQueryActionCreators = {
  searchProjectMemberCandidate: factory.create<string>(
    'SEARCH_PROJECT_MEMBER_CANDIDATE'
  )
};

export const userCollectionActionCreator = factory.build();

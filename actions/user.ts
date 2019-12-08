import { User } from '../reducer';
import { fbFactory } from './todo';

export const userCollectionActionCreator = fbFactory.firestore.collection<User>(
  'users'
);

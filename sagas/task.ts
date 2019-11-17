import { taskCollectionActionCreator } from '../actions/todo';
import { bindFireStoreCollection } from './firestore';

export const taskWatchers = bindFireStoreCollection(
  taskCollectionActionCreator
);

import * as firebase from 'firebase';
import { taskCollectionActionCreator } from '../actions/todo';
import { TaskID } from '../domain/todo';
import { bindFireStoreCollection } from './firestore';

const taskDocSelector = (db: firebase.firestore.Firestore, task: TaskID) => {
  return db.collection('tasks').doc(task.id);
};

const taskCollectionSelector = (db: firebase.firestore.Firestore) => {
  return db.collection('tasks');
};

export const taskWatchers = bindFireStoreCollection(
  taskCollectionActionCreator,
  {
    add: taskCollectionSelector,
    modify: taskDocSelector,
    remove: taskDocSelector
  }
);

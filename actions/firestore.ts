import * as firebase from 'firebase/app';
import 'firebase/firestore';
import actionCreatorFactory from 'typescript-fsa';
import { ITask } from '../domain/todo';

const firestoreActionCreatorFactory = actionCreatorFactory('FIRESTORE');

export const firestoreAsyncActionCreators = {
  addTask: firestoreActionCreatorFactory.async<
    ITask,
    firebase.firestore.DocumentReference
  >('ADD_TASKS')
};

export const firestoreActionCreators = {
  addedTasks: firestoreActionCreatorFactory<ITask[]>('ADDED_TASKS'),
  modifiedTasks: firestoreActionCreatorFactory<ITask[]>('MODIFIED_TASKS'),
  removedTasks: firestoreActionCreatorFactory<ITask[]>('REMOVED_TASKS')
};

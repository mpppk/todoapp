import * as firebase from 'firebase/app';
import 'firebase/firestore';
import actionCreatorFactory from 'typescript-fsa';
import { ITask, ITaskDraft, TaskID } from '../domain/todo';

const firestoreActionCreatorFactory = actionCreatorFactory('FIRESTORE');

export const firestoreAsyncActionCreators = {
  addTask: firestoreActionCreatorFactory.async<
    ITaskDraft,
    firebase.firestore.DocumentReference
  >('ADD_TASKS'),
  deleteTask: firestoreActionCreatorFactory.async<
    TaskID,
    firebase.firestore.DocumentReference
  >('DELETE_TASKS'),
  modifyTask: firestoreActionCreatorFactory.async<
    ITask,
    firebase.firestore.DocumentReference
  >('MODIFY_TASKS')
};

export const firestoreActionCreators = {
  addedTasks: firestoreActionCreatorFactory<ITask[]>('ADDED_TASKS'),
  modifiedTasks: firestoreActionCreatorFactory<ITask[]>('MODIFIED_TASKS'),
  removedTasks: firestoreActionCreatorFactory<ITask[]>('REMOVED_TASKS')
};

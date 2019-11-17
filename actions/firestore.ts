import * as firebase from 'firebase/app';
import 'firebase/firestore';
import actionCreatorFactory from 'typescript-fsa';
import { ITask, ITaskDraft, TaskID } from '../domain/todo';
import { IAddDocParam, IUpdateDocParam } from '../sagas/firestore';

const firestoreActionCreatorFactory = actionCreatorFactory('FIRESTORE');

export type ModifyTaskParam = IUpdateDocParam<ITask, TaskID>;
export const firestoreAsyncActionCreators = {
  addTask: firestoreActionCreatorFactory.async<
    IAddDocParam<ITaskDraft>,
    firebase.firestore.DocumentReference
  >('ADD_TASKS'),
  deleteTask: firestoreActionCreatorFactory.async<
    TaskID,
    firebase.firestore.DocumentReference
  >('DELETE_TASKS'),
  modifyTask: firestoreActionCreatorFactory.async<
    ModifyTaskParam,
    firebase.firestore.DocumentReference
  >('MODIFY_TASKS')
};

export const firestoreActionCreators = {
  addedTasks: firestoreActionCreatorFactory<ITask[]>('ADDED_TASKS'),
  modifiedTasks: firestoreActionCreatorFactory<ITask[]>('MODIFIED_TASKS'),
  removedTasks: firestoreActionCreatorFactory<ITask[]>('REMOVED_TASKS')
};

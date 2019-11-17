import * as firebase from 'firebase/app';
import 'firebase/firestore';
import actionCreatorFactory, { ActionCreator } from 'typescript-fsa';
import { ITask, ITaskDraft, TaskID } from '../domain/todo';
import { IAddDocParam, IUpdateDocParam } from '../sagas/firestore';

const firestoreActionCreatorFactory = actionCreatorFactory('FIRESTORE');

export interface ICollectionActionCreator<Doc> {
  added: ActionCreator<Doc[]>;
  modified: ActionCreator<Doc[]>;
  removed: ActionCreator<Doc[]>;
}

export const firebaseActionCreatorFactory = (prefix: string) => {
  const factory = actionCreatorFactory(prefix);
  return {
    firestore: {
      collection: <Doc>(docName: string): ICollectionActionCreator<Doc> => {
        return {
          added: factory<Doc[]>(`${docName}_ADDED`),
          modified: factory<Doc[]>(`${docName}_MODIFIED`),
          removed: factory<Doc[]>(`${docName}_REMOVED`)
        };
      }
    }
  };
};

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

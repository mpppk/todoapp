import * as firebase from 'firebase';
import { firestoreAsyncActionCreators } from '../actions/firestore';
import { TaskID } from '../domain/todo';
import { watchAddDoc, watchDeleteDoc, watchUpdateDoc } from './firestore';

const createTaskDoc = (db: firebase.firestore.Firestore, task: TaskID) => {
  return db.collection('tasks').doc(task.id);
};

const createTaskCollection = (db: firebase.firestore.Firestore) => {
  return db.collection('tasks');
};

export const taskWatchers = [
  watchAddDoc(createTaskCollection, firestoreAsyncActionCreators.addTask),
  watchUpdateDoc(createTaskDoc, firestoreAsyncActionCreators.modifyTask),
  watchDeleteDoc(createTaskDoc, firestoreAsyncActionCreators.deleteTask)
];

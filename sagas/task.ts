import * as firebase from 'firebase';
import { firestoreAsyncActionCreators } from '../actions/firestore';
import { TaskID } from '../domain/todo';
import { watchDeleteDoc } from './firestore';

const createTaskDoc = (db: firebase.firestore.Firestore, task: TaskID) => {
  return db.collection('tasks').doc(task.id);
};

export const taskWatchers = [
  watchDeleteDoc(createTaskDoc, firestoreAsyncActionCreators.deleteTask)
];

import actionCreatorFactory from 'typescript-fsa';
import { ITask } from '../domain/todo';

const firestoreActionCreatorFactory = actionCreatorFactory('FIRESTORE');

export interface IRequestToGetTasksPayload {
  projectId: number;
}

export const firestoreAsyncActionCreators = {
  getTasks: firestoreActionCreatorFactory.async<
    IRequestToGetTasksPayload,
    ITask[]
  >('GET_TASKS')
};

export const firestoreActionCreators = {
  requestToGetTasks: firestoreActionCreatorFactory<IRequestToGetTasksPayload>(
    'REQUEST_TO_GET_TASKS'
  )
};

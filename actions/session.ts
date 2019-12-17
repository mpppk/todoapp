import firebase from 'firebase';
import actionCreatorFactory from 'typescript-fsa';
import { User } from '../domain/user';

const sessionActionCreatorFactory = actionCreatorFactory('SESSION');

export const sessionAsyncActionCreators = {
  logout: sessionActionCreatorFactory.async('LOGOUT')
};

export const sessionActionCreators = {
  finishFirebaseInitializing: sessionActionCreatorFactory(
    'FINISH_FIREBASE_INITIALIZING'
  ),
  login: sessionActionCreatorFactory<firebase.User>('LOGIN'),
  requestToInitializeFirebase: sessionActionCreatorFactory(
    'REQUEST_TO_INITIALIZE_FIREBASE'
  ),
  requestToLogout: sessionActionCreatorFactory('REQUEST_TO_LOGOUT'),
  updateUser: sessionActionCreatorFactory<UpdateUserPayload>('UPDATE_USER')
};

export interface UpdateUserPayload {
  user: User;
}

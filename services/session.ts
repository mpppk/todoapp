import firebase from 'firebase';
import getConfig from 'next/config';
import { User } from '../domain/user';
const { publicRuntimeConfig } = getConfig();

export const fromFirebaseUserToUser = (user: firebase.User): User => {
  return {
    displayName: user.displayName ? user.displayName : undefined,
    email: user.email ? user.email : undefined,
    emailVerified: user.emailVerified,
    id: user.uid,
    isAnonymous: user.isAnonymous,
    phoneNumber: user.phoneNumber,
    photoURL: user.photoURL ? user.photoURL : undefined
  };
};

export const initializeFirebase = () => {
  // Configure Firebase.
  if (!firebase.apps.length) {
    const firebaseConfig = publicRuntimeConfig.firebase;
    firebase.initializeApp(firebaseConfig);
  }
};

export const getFirebaseUIConfig = () => {
  // Configure FirebaseUI.
  return {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/'
  };
};

export const FieldValue = firebase.firestore.FieldValue;

let db: firebase.firestore.Firestore | null = null;
export const getFirestore = () => {
  if (db === null) {
    db = firebase.firestore();
    // if (location.hostname === 'localhost') {
    //   db.settings({
    //     host: 'localhost:8081',
    //     ssl: false,
    //   })
    // }
  }
  return db;
};

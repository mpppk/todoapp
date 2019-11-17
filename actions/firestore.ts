import * as firebase from 'firebase/app';
import 'firebase/firestore';
import actionCreatorFactory, {
  ActionCreator,
  AsyncActionCreators
} from 'typescript-fsa';
import {
  AddDocParam,
  DocBase,
  DocWithOutBase,
  UpdateDocParam
} from '../sagas/firestore';

export interface CollectionActionCreator<Doc extends DocBase> {
  add: AsyncActionCreators<
    AddDocParam<DocWithOutBase<Doc>, DocWithOutBase<Doc>>,
    firebase.firestore.DocumentReference
  >;
  collectionPath: string;
  modify: AsyncActionCreators<
    UpdateDocParam<Doc>,
    firebase.firestore.DocumentReference
  >;
  remove: AsyncActionCreators<Doc, firebase.firestore.DocumentReference>;
  added: ActionCreator<Doc[]>;
  modified: ActionCreator<Doc[]>;
  removed: ActionCreator<Doc[]>;
}

export const firebaseActionCreatorFactory = (prefix: string) => {
  const factory = actionCreatorFactory(prefix);
  return {
    firestore: {
      collection: <Doc extends DocBase>(
        collectionPath: string
      ): CollectionActionCreator<Doc> => {
        const eventPrefix = collectionPath.toUpperCase();
        return {
          add: factory.async<
            AddDocParam<DocWithOutBase<Doc>>,
            firebase.firestore.DocumentReference
          >(`${eventPrefix}_ADD`),
          added: factory<Doc[]>(`${eventPrefix}_ADDED`),
          collectionPath,
          modified: factory<Doc[]>(`${eventPrefix}_MODIFIED`),
          modify: factory.async<
            UpdateDocParam<Doc>,
            firebase.firestore.DocumentReference
          >(`${eventPrefix}_MODIFY`),
          remove: factory.async<Doc, firebase.firestore.DocumentReference>(
            `${eventPrefix}_REMOVE`
          ),
          removed: factory<Doc[]>(`${eventPrefix}_REMOVED`)
        };
      }
    }
  };
};

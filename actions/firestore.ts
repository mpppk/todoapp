import * as firebase from 'firebase/app';
import 'firebase/firestore';
import actionCreatorFactory, {
  ActionCreator,
  AsyncActionCreators
} from 'typescript-fsa';
import {
  DocWithOutBase,
  IAddDocParam,
  IDocBase,
  IUpdateDocParam
} from '../sagas/firestore';

export interface ICollectionActionCreator<Doc extends IDocBase> {
  add: AsyncActionCreators<
    IAddDocParam<DocWithOutBase<Doc>, DocWithOutBase<Doc>>,
    firebase.firestore.DocumentReference
  >;
  collectionPath: string;
  modify: AsyncActionCreators<
    IUpdateDocParam<Doc>,
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
      collection: <Doc extends IDocBase>(
        collectionPath: string
      ): ICollectionActionCreator<Doc> => {
        const eventPrefix = collectionPath.toUpperCase();
        return {
          add: factory.async<
            IAddDocParam<DocWithOutBase<Doc>>,
            firebase.firestore.DocumentReference
          >(`${eventPrefix}_ADD`),
          added: factory<Doc[]>(`${eventPrefix}_ADDED`),
          collectionPath,
          modified: factory<Doc[]>(`${eventPrefix}_MODIFIED`),
          modify: factory.async<
            IUpdateDocParam<Doc>,
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

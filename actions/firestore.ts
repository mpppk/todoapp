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
        docName: string
      ): ICollectionActionCreator<Doc> => {
        return {
          add: factory.async<
            IAddDocParam<DocWithOutBase<Doc>>,
            firebase.firestore.DocumentReference
          >(`${docName}_ADD`),
          added: factory<Doc[]>(`${docName}_ADDED`),
          modified: factory<Doc[]>(`${docName}_MODIFIED`),
          modify: factory.async<
            IUpdateDocParam<Doc>,
            firebase.firestore.DocumentReference
          >(`${docName}_MODIFY`),
          remove: factory.async<Doc, firebase.firestore.DocumentReference>(
            `${docName}_REMOVE`
          ),
          removed: factory<Doc[]>(`${docName}_REMOVED`)
        };
      }
    }
  };
};

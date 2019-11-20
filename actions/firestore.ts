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

export interface SubscribeActionPayload {
  [key: string]: string | number;
}
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
  subscribe: ActionCreator<SubscribeActionPayload>;
  unsubscribe: ActionCreator<SubscribeActionPayload>;
}

export const firebaseActionCreatorFactory = (prefix: string) => {
  const factory = actionCreatorFactory(prefix);

  const collectionActionCreator = <Doc extends DocBase>(
    collectionPath: string
  ): CollectionActionCreator<Doc> => {
    const eventPrefix = collectionPath.toUpperCase();

    const add = factory.async<
      AddDocParam<DocWithOutBase<Doc>>,
      firebase.firestore.DocumentReference
    >(`${eventPrefix}_ADD`);

    const modify = factory.async<
      UpdateDocParam<Doc>,
      firebase.firestore.DocumentReference
    >(`${eventPrefix}_MODIFY`);

    const remove = factory.async<Doc, firebase.firestore.DocumentReference>(
      `${eventPrefix}_REMOVE`
    );

    return {
      add,
      added: factory<Doc[]>(`${eventPrefix}_ADDED`),
      collectionPath,
      modified: factory<Doc[]>(`${eventPrefix}_MODIFIED`),
      modify,
      remove,
      removed: factory<Doc[]>(`${eventPrefix}_REMOVED`),
      subscribe: factory<SubscribeActionPayload>(`${eventPrefix}_SUBSCRIBE`),
      unsubscribe: factory<SubscribeActionPayload>(`${eventPrefix}_UNSUBSCRIBE`)
    };
  };

  return {
    firestore: {
      collection: collectionActionCreator
    }
  };
};

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import actionCreatorFactory, {
  ActionCreator,
  AsyncActionCreators
} from 'typescript-fsa';
import { DocBase, DocParam, DocWithOutBase } from '../sagas/firestore';

// tslint:disable-next-line
export type SubscribeActionPayload = {};

export interface SnapshotEventPayload<Doc> {
  payload: SubscribeActionPayload;
  docs: Doc[];
}

export interface CollectionActionCreator<Doc extends DocBase> {
  add: AsyncActionCreators<
    DocParam<DocWithOutBase<Doc>>,
    firebase.firestore.DocumentReference
  >;
  collectionPath: string;
  modify: AsyncActionCreators<
    DocParam<Doc>,
    firebase.firestore.DocumentReference
  >;
  remove: AsyncActionCreators<
    SubscribeActionPayload,
    firebase.firestore.DocumentReference
  >;
  added: ActionCreator<SnapshotEventPayload<Doc>>;
  modified: ActionCreator<SnapshotEventPayload<Doc>>;
  removed: ActionCreator<SnapshotEventPayload<Doc>>;
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
      DocParam<DocWithOutBase<Doc>>,
      firebase.firestore.DocumentReference
    >(`${eventPrefix}_ADD`);

    const modify = factory.async<
      DocParam<Doc>,
      firebase.firestore.DocumentReference
    >(`${eventPrefix}_MODIFY`);

    const remove = factory.async<
      SubscribeActionPayload,
      firebase.firestore.DocumentReference
    >(`${eventPrefix}_REMOVE`);

    return {
      add,
      added: factory<SnapshotEventPayload<Doc>>(`${eventPrefix}_ADDED`),
      collectionPath,
      modified: factory<SnapshotEventPayload<Doc>>(`${eventPrefix}_MODIFIED`),
      modify,
      remove,
      removed: factory<SnapshotEventPayload<Doc>>(`${eventPrefix}_REMOVED`),
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

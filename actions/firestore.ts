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
    DocParam<Partial<Doc>>,
    firebase.firestore.DocumentReference
  >;
  remove: AsyncActionCreators<
    SubscribeActionPayload & DocBase,
    firebase.firestore.DocumentReference
  >;
  added: ActionCreator<SnapshotEventPayload<Doc>>;
  modified: ActionCreator<SnapshotEventPayload<Doc>>;
  removed: ActionCreator<SnapshotEventPayload<Doc>>;
  subscribe: AsyncActionCreators<SubscribeActionPayload, undefined>;
  unsubscribe: AsyncActionCreators<SubscribeActionPayload, undefined>;
  get: AsyncActionCreators<DocParam<string>, Doc>;
}

export interface CollectionQueryActionCreators<Result = any> {
  [key: string]: AsyncActionCreators<any, Result>; // FIXME
}

export interface FirebaseCollectionActionCreatorFactory<Doc extends DocBase> {
  build: () => CollectionActionCreator<Doc>;
  create: <T>(type: string) => AsyncActionCreators<T, any>;
}

export const firebaseActionCreatorFactory = (prefix: string) => {
  const factory = actionCreatorFactory(prefix);

  const collectionActionCreator = <Doc extends DocBase>(
    collectionPath: string
  ): FirebaseCollectionActionCreatorFactory<Doc> => {
    const eventPrefix = collectionPath.toUpperCase();

    const add = factory.async<
      DocParam<DocWithOutBase<Doc>>,
      firebase.firestore.DocumentReference
    >(`${eventPrefix}_ADD`);

    const modify = factory.async<
      DocParam<Partial<Doc>>,
      firebase.firestore.DocumentReference
    >(`${eventPrefix}_MODIFY`);

    const remove = factory.async<
      SubscribeActionPayload & DocBase,
      firebase.firestore.DocumentReference
    >(`${eventPrefix}_REMOVE`);

    const newActionCreator = <T>(type: string) => {
      return factory<T>(`${eventPrefix}_${type}`);
    };

    return {
      build: () => {
        return {
          add,
          added: factory<SnapshotEventPayload<Doc>>(`${eventPrefix}_ADDED`),
          collectionPath,
          get: factory.async<DocParam<string>, Doc>(`${eventPrefix}_GET`),
          modified: factory<SnapshotEventPayload<Doc>>(
            `${eventPrefix}_MODIFIED`
          ),
          modify,
          newActionCreator,
          remove,
          removed: factory<SnapshotEventPayload<Doc>>(`${eventPrefix}_REMOVED`),
          subscribe: factory.async<SubscribeActionPayload, undefined>(
            `${eventPrefix}_SUBSCRIBE`
          ),
          unsubscribe: factory.async<SubscribeActionPayload, undefined>(
            `${eventPrefix}_UNSUBSCRIBE`
          )
        };
      },
      create: <Params, Result, Error = {}>(type: string) => {
        return factory.async<Params, Result, Error>(`${eventPrefix}_${type}`);
      }
    };
  };

  return {
    firestore: {
      collection: collectionActionCreator
    }
  };
};

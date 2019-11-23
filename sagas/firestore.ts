import {
  all,
  call,
  cancel,
  fork,
  put,
  take,
  takeEvery
} from '@redux-saga/core/effects';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import _ from 'lodash';
import { eventChannel } from 'redux-saga';
import { Action, AsyncActionCreators } from 'typescript-fsa';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import {
  CollectionActionCreator,
  SubscribeActionPayload
} from '../actions/firestore';

export interface DocBase {
  id: string;
}

export type DocWithOutBase<Doc> = Omit<Doc, keyof DocBase>;

function* collectionSnapshotChannel(
  collection: firebase.firestore.CollectionReference
) {
  return eventChannel(emit => {
    collection.onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => {
      emit(snapshot.docChanges());
    });

    const unsubscribe = collection.onSnapshot(() => {
      /****/
    });
    return () => unsubscribe();
  });
}

function* watchCollectionSnapShot<Doc extends DocBase>(
  actionCreators: CollectionActionCreator<Doc>,
  collection: firebase.firestore.CollectionReference,
  payload: SubscribeActionPayload
) {
  const chan = yield call(collectionSnapshotChannel, collection);
  try {
    const docChangeToDoc = (d: firebase.firestore.DocumentChange): Doc => {
      return { id: d.doc.id, ...d.doc.data() } as Doc;
    };
    while (true) {
      const docChanges: firebase.firestore.DocumentChange[] = yield take(chan);
      const addedDocs = docChanges
        .filter(d => d.type === 'added')
        .map(docChangeToDoc);
      const removedDocs = docChanges
        .filter(d => d.type === 'removed')
        .map(docChangeToDoc);
      const modifiedDocs = docChanges
        .filter(d => d.type === 'modified')
        .map(docChangeToDoc);

      if (addedDocs.length !== 0) {
        yield put(actionCreators.added({ payload, docs: addedDocs }));
      }
      if (removedDocs.length !== 0) {
        yield put(actionCreators.removed({ payload, docs: removedDocs }));
      }
      if (modifiedDocs.length !== 0) {
        yield put(actionCreators.modified({ payload, docs: modifiedDocs }));
      }
    }
  } finally {
    console.log('canceled'); // tslint:disable-line
  } // tslint:disable-line
}

type DocSelector = (
  db: firebase.firestore.Firestore,
  param: SubscribeActionPayload
) => firebase.firestore.DocumentReference;

export type CollectionSelector = (
  db: firebase.firestore.Firestore,
  param: SubscribeActionPayload
) => firebase.firestore.CollectionReference;

export interface DocParam<DocWithOutID> {
  doc: DocWithOutID;
  selectorParam: SubscribeActionPayload;
}

const bindToAddDoc = <DocWOBase, Result, Error>(
  collectionSelector: CollectionSelector,
  asyncActionCreators: AsyncActionCreators<DocParam<DocWOBase>, Result, Error>
) => {
  return bindAsyncAction(asyncActionCreators, {
    skipStartedAction: true
  })(function*(param) {
    const db = firebase.firestore();
    const collection = collectionSelector(db, param.selectorParam);
    return yield call(collection.add.bind(collection), param.doc);
  });
};

const bindToModifyDoc = <Doc, Result, Error>(
  docSelector: DocSelector,
  asyncActionCreators: AsyncActionCreators<DocParam<Doc>, Result, Error>
) => {
  return bindAsyncAction(asyncActionCreators, {
    skipStartedAction: true
  })(function*(param) {
    const db = firebase.firestore();
    const doc = docSelector(db, param.selectorParam);
    return yield call(doc.set.bind(doc), param.doc);
  });
};

const bindToRemoveDoc = <Result, Error>(
  docSelector: DocSelector,
  asyncActionCreators: AsyncActionCreators<
    SubscribeActionPayload,
    Result,
    Error
  >
) => {
  return bindAsyncAction(asyncActionCreators, {
    skipStartedAction: true
  })(function*(selectorParam: SubscribeActionPayload) {
    const db = firebase.firestore();
    const doc = docSelector(db, selectorParam);
    return yield call(doc.delete.bind(doc));
  });
};

export const parseCollectionPath = <Doc extends { [key: string]: any }>(
  collectionPath: string,
  param: Doc
): string => {
  return collectionPath
    .split('/')
    .map(collection => {
      const v = /{(.+?)}/.exec(collection);
      if (!v || v.length < 2 || !param.hasOwnProperty(v[1])) {
        return collection;
      }
      const key = v[1];
      if (!['number', 'string'].includes(typeof param[key])) {
        return collection;
      }
      return v && param.hasOwnProperty(key) ? param[key] : collection;
    })
    .join('/');
};

type Task = any; // FIXME

const generateCollectionSelector = (collectionPath: string) => {
  return (db: firebase.firestore.Firestore, params: SubscribeActionPayload) => {
    const parsedPath = parseCollectionPath(collectionPath, params);
    return db.collection(parsedPath);
  };
};

const generateDocSelector = (collectionPath: string) => {
  return (db: firebase.firestore.Firestore, params: SubscribeActionPayload) => {
    const parsedPath = parseCollectionPath(collectionPath, params);
    if (!params.hasOwnProperty('id')) {
      throw Error('doc param does not have id. ' + params);
    }
    // FIXME any
    return db.collection(parsedPath).doc((params as any).id);
  };
};

export const bindFireStoreCollection = <Doc extends DocBase>(
  actionCreators: CollectionActionCreator<Doc>,
  collectionSelector: CollectionSelector = generateCollectionSelector(
    actionCreators.collectionPath
  )
) => {
  function* observe() {
    const subscriptions: Array<[Task, SubscribeActionPayload]> = [];

    function* subscribeWorker(action: Action<SubscribeActionPayload>) {
      const payload = action.payload;
      if (subscriptions.find(s => _.isEqual(s[1], payload))) {
        return;
      }

      const collection = collectionSelector(
        firebase.firestore(),
        action.payload
      ); // FIXME
      const w = watchCollectionSnapShot.bind(
        watchCollectionSnapShot,
        actionCreators as CollectionActionCreator<any>, // FIXME
        collection,
        action.payload
      );
      const task = yield fork(w);
      subscriptions.push([task, payload]);
    }

    function* unsubscribeWorker(action: Action<SubscribeActionPayload>) {
      const payload = action.payload;
      const index = subscriptions.findIndex(s => _.isEqual(s[1], payload));
      if (index === -1) {
        return;
      }
      const subscription = subscriptions[index];
      subscriptions.splice(index, 1);
      yield cancel(subscription[0]);
    }

    yield all([
      (function*() {
        yield takeEvery(actionCreators.subscribe.type, subscribeWorker);
      })(),
      (function*() {
        yield takeEvery(actionCreators.unsubscribe.type, unsubscribeWorker);
      })()
    ]);
  }

  const docSelector = generateDocSelector(actionCreators.collectionPath);
  return {
    add: bindToAddDoc(collectionSelector, actionCreators.add),
    modify: bindToModifyDoc(docSelector, actionCreators.modify),
    observe,
    remove: bindToRemoveDoc(docSelector, actionCreators.remove)
  };
};

export const takeEveryStartedAction = (
  actionCreator: CollectionActionCreator<any>,
  workers: any
) => {
  return [
    (function*() {
      yield takeEvery(actionCreator.add.started, (action: Action<any>) =>
        workers.add(action.payload)
      );
    })(),
    (function*() {
      yield takeEvery(actionCreator.modify.started, (action: Action<any>) =>
        workers.modify(action.payload)
      );
    })(),
    (function*() {
      yield takeEvery(actionCreator.remove.started, (action: Action<any>) =>
        workers.remove(action.payload)
      );
    })()
  ];
};

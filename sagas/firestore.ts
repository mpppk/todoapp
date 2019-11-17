import { call, put, take, takeEvery } from '@redux-saga/core/effects';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { eventChannel } from 'redux-saga';
import { Action, AsyncActionCreators } from 'typescript-fsa';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import { CollectionActionCreator } from '../actions/firestore';

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
  actionCreators: CollectionActionCreator<Doc>
) {
  const collection = firebase
    .firestore()
    .collection(actionCreators.collectionPath);
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
        yield put(actionCreators.added(addedDocs));
      }
      if (removedDocs.length !== 0) {
        yield put(actionCreators.removed(removedDocs));
      }
      if (modifiedDocs.length !== 0) {
        yield put(actionCreators.modified(modifiedDocs));
      }
    }
  } finally {
  } // tslint:disable-line
}

export type DocSelector<Param> = (
  db: firebase.firestore.Firestore,
  param: Param
) => firebase.firestore.DocumentReference;
export type CollectionSelector<Param> = (
  db: firebase.firestore.Firestore,
  param: Param
) => firebase.firestore.CollectionReference;

export interface AddDocParam<DocWithOutID, SelectorParam = DocWithOutID> {
  doc: DocWithOutID;
  selectorParam: SelectorParam;
}

const bindToAddDoc = <DocWOBase, SelectorParam, Result, Error>(
  collectionSelector: CollectionSelector<SelectorParam>,
  asyncActionCreators: AsyncActionCreators<
    AddDocParam<DocWOBase, SelectorParam>,
    Result,
    Error
  >
) => {
  return bindAsyncAction(asyncActionCreators, {
    skipStartedAction: true
  })(function*(param) {
    const db = firebase.firestore();
    const collection = collectionSelector(db, param.selectorParam);
    return yield call(collection.add.bind(collection), param.doc);
  });
};

export type UpdateDocParam<Doc, SelectorParam = Doc> = AddDocParam<
  Doc,
  SelectorParam
>;

const bindToModifyDoc = <Doc, SelectorParam, Result, Error>(
  docSelector: DocSelector<SelectorParam>,
  asyncActionCreators: AsyncActionCreators<
    UpdateDocParam<Doc, SelectorParam>,
    Result,
    Error
  >
) => {
  return bindAsyncAction(asyncActionCreators, {
    skipStartedAction: true
  })(function*(param) {
    const db = firebase.firestore();
    const doc = docSelector(db, param.selectorParam);
    return yield call(doc.set.bind(doc), param.doc);
  });
};
const bindToRemoveDoc = <SelectorParam, Result, Error>(
  docSelector: DocSelector<SelectorParam>,
  asyncActionCreators: AsyncActionCreators<SelectorParam, Result, Error>
) => {
  return bindAsyncAction(asyncActionCreators, {
    skipStartedAction: true
  })(function*(selectorParam: SelectorParam) {
    const db = firebase.firestore();
    const doc = docSelector(db, selectorParam);
    return yield call(doc.delete.bind(doc));
  });
};

interface Selectors<Doc> {
  add: CollectionSelector<DocWithOutBase<Doc>>;
  modify: DocSelector<Doc>;
  remove: DocSelector<Doc>;
}

const newDocSelector = (collectionPath: string) => {
  return (db: firebase.firestore.Firestore, docBase: DocBase) => {
    return db.collection(collectionPath).doc(docBase.id);
  };
};

const newCollectionSelector = (collectionPath: string) => {
  return (db: firebase.firestore.Firestore) => {
    return db.collection(collectionPath);
  };
};

export const bindFireStoreCollection = <Doc extends DocBase>(
  actionCreators: CollectionActionCreator<Doc>,
  selectors?: Selectors<Doc>
) => {
  if (!selectors) {
    selectors = {
      add: newCollectionSelector(actionCreators.collectionPath),
      modify: newDocSelector(actionCreators.collectionPath),
      remove: newDocSelector(actionCreators.collectionPath)
    };
  }

  return {
    add: bindToAddDoc(selectors.add, actionCreators.add),
    modify: bindToModifyDoc(selectors.modify, actionCreators.modify),
    observe: watchCollectionSnapShot.bind(
      watchCollectionSnapShot,
      actionCreators as CollectionActionCreator<any> // FIXME
    ),
    remove: bindToRemoveDoc(selectors.remove, actionCreators.remove)
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

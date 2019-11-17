import { call, put, take, takeEvery } from '@redux-saga/core/effects';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { eventChannel } from 'redux-saga';
import { Action, AsyncActionCreators } from 'typescript-fsa';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import { ICollectionActionCreator } from '../actions/firestore';

export interface IDocBase {
  id: string;
}

export type DocWithOutBase<Doc> = Omit<Doc, keyof IDocBase>;

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

export function* watchCollectionSnapShot<Doc extends IDocBase>(
  collection: firebase.firestore.CollectionReference,
  actionCreators: ICollectionActionCreator<Doc>
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

export interface IAddDocParam<DocWithOutID, SelectorParam = DocWithOutID> {
  doc: DocWithOutID;
  selectorParam: SelectorParam;
}

function* watchAddDoc<DocWOBase, SelectorParam, Result, Error>(
  collectionSelector: CollectionSelector<SelectorParam>,
  asyncActionCreators: AsyncActionCreators<
    IAddDocParam<DocWOBase, SelectorParam>,
    Result,
    Error
  >
) {
  const addTaskWorker = bindAsyncAction(asyncActionCreators, {
    skipStartedAction: true
  })(function*(param) {
    const db = firebase.firestore();
    const collection = collectionSelector(db, param.selectorParam);
    return yield call(collection.add.bind(collection), param.doc);
  });

  function* worker(action: Action<IAddDocParam<DocWOBase, SelectorParam>>) {
    yield addTaskWorker(action.payload);
  }

  yield takeEvery(asyncActionCreators.started.type, worker);
}

export type IUpdateDocParam<Doc, SelectorParam = Doc> = IAddDocParam<
  Doc,
  SelectorParam
>;

function* watchModifyDoc<Doc, SelectorPram, Result, Error>(
  docSelector: DocSelector<SelectorPram>,
  asyncActionCreators: AsyncActionCreators<
    IUpdateDocParam<Doc, SelectorPram>,
    Result,
    Error
  >
) {
  const modifyTaskWorker = bindAsyncAction(asyncActionCreators, {
    skipStartedAction: true
  })(function*(param: IUpdateDocParam<Doc, SelectorPram>) {
    const db = firebase.firestore();
    const doc = docSelector(db, param.selectorParam);
    return yield call(doc.set.bind(doc), param.doc);
  });

  function* worker(action: Action<IUpdateDocParam<Doc, SelectorPram>>) {
    yield modifyTaskWorker(action.payload);
  }

  yield takeEvery(asyncActionCreators.started.type, worker);
}

function* watchRemoveDoc<SelectorParam, Result, Error>(
  docSelector: DocSelector<SelectorParam>,
  asyncActionCreators: AsyncActionCreators<SelectorParam, Result, Error>
) {
  const deleteDocWorker = bindAsyncAction(asyncActionCreators, {
    skipStartedAction: true
  })(function*(selectorParam: SelectorParam) {
    const db = firebase.firestore();
    const doc = docSelector(db, selectorParam);
    return yield call(doc.delete.bind(doc));
  });

  function* worker(action: Action<SelectorParam>) {
    yield deleteDocWorker(action.payload);
  }

  yield takeEvery(asyncActionCreators.started.type, worker);
}

interface ISelectors<Doc> {
  add: CollectionSelector<DocWithOutBase<Doc>>;
  modify: DocSelector<Doc>;
  remove: DocSelector<Doc>;
}

export const bindFireStoreCollection = <Doc extends IDocBase>(
  actionCreators: ICollectionActionCreator<Doc>,
  selectors?: ISelectors<Doc>
) => {
  if (!selectors) {
    selectors = {
      add: newCollectionSelector(actionCreators.collectionPath),
      modify: newDocSelector(actionCreators.collectionPath),
      remove: newDocSelector(actionCreators.collectionPath)
    };
  }

  return {
    read: () => {
      const collection = firebase
        .firestore()
        .collection(actionCreators.collectionPath);
      return watchCollectionSnapShot.bind(
        watchCollectionSnapShot,
        collection,
        actionCreators as ICollectionActionCreator<any> // FIXME
      );
    },
    write: [
      watchAddDoc(selectors.add, actionCreators.add),
      watchModifyDoc(selectors.modify, actionCreators.modify),
      watchRemoveDoc(selectors.remove, actionCreators.remove)
    ]
  };
};

const newDocSelector = (collectionPath: string) => {
  return (db: firebase.firestore.Firestore, docBase: IDocBase) => {
    return db.collection(collectionPath).doc(docBase.id);
  };
};

const newCollectionSelector = (collectionPath: string) => {
  return (db: firebase.firestore.Firestore) => {
    return db.collection(collectionPath);
  };
};

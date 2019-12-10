import {
  all,
  call,
  cancel,
  cancelled,
  fork,
  put,
  select,
  take,
  takeEvery
} from '@redux-saga/core/effects';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import _ from 'lodash';
import { eventChannel } from 'redux-saga';
import { Action } from 'typescript-fsa';
import { bindAsyncAction } from 'typescript-fsa-redux-saga';
import {
  CollectionActionCreator,
  CollectionQueryActionCreators,
  SubscribeActionPayload
} from '../actions/firestore';
import { State } from '../reducers/reducer';
import { parseCollectionPath } from '../services/firestore';
import { getFirestore } from '../services/session';

export interface DocBase {
  id: string;
}

export type DocWithOutBase<Doc> = Omit<Doc, keyof DocBase>;

function* querySnapshotChannel(query: firebase.firestore.Query) {
  return eventChannel(emit => {
    query.onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => {
      emit(snapshot.docChanges());
    });
    return () => {
      query.onSnapshot(() => {
        /****/
      });
    };
  });
}

function* watchQuerySnapShot<Doc extends DocBase>(
  actionCreators: CollectionActionCreator<Doc>,
  query: firebase.firestore.Query,
  payload: SubscribeActionPayload
) {
  const chan = yield call(querySnapshotChannel, query);
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
  } catch (e) {
    throw e;
  } finally {
    if (yield cancelled()) {
      console.log('canceled'); // tslint:disable-line
    }
  } // tslint:disable-line
}

export type QueryBuilder<Context> = (
  context: Context,
  state: State,
  collection: firebase.firestore.CollectionReference
) => firebase.firestore.Query;

export interface QueriesQueryBuilders<Context> {
  [key: string]: QueryBuilder<Context>;
}

export interface QueryBuilders<Context> {
  subscribe: QueryBuilder<Context>;
  queries: QueriesQueryBuilders<Context>;
}

export interface DocParam<T> {
  doc: T;
  selectorParam: SubscribeActionPayload;
}

type Task = any; // FIXME

const generateCollectionSelector = (collectionPath: string) => {
  return (db: firebase.firestore.Firestore, params: SubscribeActionPayload) => {
    const parsedPath = parseCollectionPath(collectionPath, params);
    return db.collection(parsedPath);
  };
};

const generateBypassQueryBuilders = <Context>() => {
  return {
    queries: {},
    subscribe: (
      _context: Context,
      _state: State,
      collection: firebase.firestore.CollectionReference
    ) => collection
  };
};

export const bindFireStoreCollection = <Doc extends DocBase>(
  actionCreators: CollectionActionCreator<Doc>,
  queryActionCreators: CollectionQueryActionCreators = {},
  queryBuilders: QueryBuilders<
    SubscribeActionPayload
  > = generateBypassQueryBuilders()
) => {
  const collectionSelector = generateCollectionSelector(
    actionCreators.collectionPath
  );

  function* observe() {
    const subscriptions: Array<[Task, SubscribeActionPayload]> = [];

    function* subscribeWorker(payload: SubscribeActionPayload) {
      if (subscriptions.find(s => _.isEqual(s[1], payload))) {
        return;
      }

      const collection = collectionSelector(getFirestore(), payload); // FIXME

      const state = yield select();
      const w = watchQuerySnapShot.bind(
        watchQuerySnapShot,
        actionCreators as CollectionActionCreator<any>, // FIXME
        queryBuilders.subscribe(payload, state, collection),
        payload
      );
      const task = yield fork(w);
      subscriptions.push([task, payload]);
    }

    function* unsubscribeWorker(payload: SubscribeActionPayload) {
      const index = subscriptions.findIndex(s => _.isEqual(s[1], payload));
      if (index === -1) {
        return;
      }
      const subscription = subscriptions[index];
      subscriptions.splice(index, 1);
      yield cancel(subscription[0]);
    }

    const subscribeWorker2 = bindAsyncAction(actionCreators.subscribe, {
      skipStartedAction: true
    })(subscribeWorker);
    const unsubscribeWorker2 = bindAsyncAction(actionCreators.unsubscribe, {
      skipStartedAction: true
    })(unsubscribeWorker);

    yield all([
      (function*() {
        function* worker(action: Action<SubscribeActionPayload>) {
          yield subscribeWorker2(action.payload);
        }

        yield takeEvery(actionCreators.subscribe.started.type, worker);
      })(),
      (function*() {
        function* worker(action: Action<SubscribeActionPayload>) {
          yield unsubscribeWorker2(action.payload);
        }

        yield takeEvery(actionCreators.unsubscribe.started.type, worker);
      })()
    ]);
  }

  const opt = { skipStartedAction: true };
  const queries = Object.keys(queryBuilders.queries).reduce<any>(
    (acc, queryName) => {
      acc[queryName] = bindAsyncAction(
        queryActionCreators[queryName],
        opt
      )(function*(param) {
        const state = yield select();
        const collection = collectionSelector(getFirestore(), param as any); // FIXME
        const query: firebase.firestore.Query = queryBuilders.queries[
          queryName
        ](param as any, state, collection);
        return yield call(query.get.bind(query));
      });
      return acc;
    },
    {}
  );

  return {
    add: bindAsyncAction(
      actionCreators.add,
      opt
    )(function*(param) {
      const context = { ...param.doc, ...param.selectorParam };
      const collection = collectionSelector(getFirestore(), context); // FIXME
      return yield call(collection.add.bind(collection), param.doc);
    }),
    modify: bindAsyncAction(
      actionCreators.modify,
      opt
    )(function*(param) {
      const context = { ...param.doc, ...param.selectorParam };
      const collection = collectionSelector(getFirestore(), context); // FIXME
      const doc = collection.doc(context.id);
      // FIXME any
      return yield call(doc.update.bind(doc) as any, param.doc);
    }),
    observe,
    queries,
    remove: bindAsyncAction(
      actionCreators.remove,
      opt
    )(function*(selectorParam) {
      const collection = collectionSelector(getFirestore(), selectorParam); // FIXME
      const doc = collection.doc(selectorParam.id);
      return yield call(doc.delete.bind(doc));
    })
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

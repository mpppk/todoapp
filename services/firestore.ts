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

export interface Document {
  id: string;
}

export const updateDocuments = <T extends Document>(
  documents: T[],
  newDocuments: T[]
): T[] => {
  return newDocuments.reduce(
    (acc, newDocument) => {
      const index = acc.findIndex(d => d.id === newDocument.id);
      if (index === -1) {
        return [...acc, newDocument];
      }
      acc.splice(index, 1, newDocument);
      return acc;
    },
    [...documents]
  );
};

export const replaceDocument = <T extends Document>(
  documents: T[],
  newDocument: T
): T[] => {
  documents = [...documents];
  const index = documents.findIndex(p => p.id === newDocument.id);
  if (index !== -1) {
    documents[index] = newDocument;
  }
  return documents;
};

export const removeDocuments = <T extends Document>(
  documents: T[],
  remDocuments: T[]
): T[] => {
  const ids = remDocuments.map(doc => doc.id);
  return documents.filter(p => !ids.includes(p.id));
};

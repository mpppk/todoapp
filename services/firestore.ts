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

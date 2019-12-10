import { DocBase } from '../sagas/firestore';

export const compareById = (a: DocBase, b: DocBase) => {
  if (a.id > b.id) {
    return 1;
  } else if (a.id < b.id) {
    return -1;
  }
  return 0;
};

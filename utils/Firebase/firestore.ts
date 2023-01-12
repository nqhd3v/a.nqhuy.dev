import { User } from "firebase/auth";
import { addDoc, deleteDoc, DocumentData, getDoc, getDocs, query, QueryConstraint, QuerySnapshot, setDoc, WithFieldValue, Timestamp, DocumentReference } from "firebase/firestore";
import { firebaseColl, firebaseDoc } from ".";
import { DocumentId, tDataTransformed } from "../types/model";

// Firestore - Timestamp utils
export const date2FsTimestamp = (date?: Date) => Timestamp.fromDate(date || new Date());

// Firestore - Add document
export const fsAdd = async <T extends any>(
  data: WithFieldValue<DocumentData>,
  path: string,
  ...pathSegments: string[]
): Promise<tDataTransformed<T> | undefined> => {
  try {
    const docRef = await addDoc(firebaseColl(path, ...pathSegments), data);
    return await fsReadOne<T>(path, ...[...pathSegments, docRef.id]);
  } catch (err) {
    throw err;
  }
}
export const fsAddWithId = async <T extends any>(
  data: WithFieldValue<DocumentData>,
  id: string,
  path: string,
  ...pathSegments: string[]
): Promise<tDataTransformed<T> | undefined> => {
  try {
    await setDoc(firebaseDoc(path, ...[...pathSegments, id]), data);
    return await fsReadOne(path, ...[...pathSegments, id]);
  } catch (err) {
    throw err;
  }
}

export const transformData = <T extends any>(querySnapshot: QuerySnapshot<DocumentData>): Record<DocumentId, tDataTransformed<T>> => {
  const data: DocumentData = {};
  querySnapshot.forEach(snap => {
    const dataItem = snap.data() as T;
    if (typeof dataItem === "object") {
      data[snap.id] = {
        data: dataItem,
        _ref: snap.ref,
        _id: snap.id,
      }
    }
  });
  return data;
}

export const transformUser = (user: User): any => ({
  photoURL: user.photoURL || '',
  displayName: user.displayName || 'No name',
  email: user.email || 'No email',
  createdAt: date2FsTimestamp(),
})

// Firestore - Read documents
export const fsRead = async (
  path: string,
  ...pathSegments: string[]
): Promise<DocumentData> => {
  try {
    const querySnapshot = await getDocs(firebaseColl(path, ...pathSegments));
    return transformData(querySnapshot);
  } catch (err: any) {
    console.error('Error when read data from Firebase:', err.toString());
    return {};
  }
};

export const fsReadWithCond = async <Type extends object>(
  queries: QueryConstraint[],
  path: string,
  ...pathSegments: string[]
): Promise<Record<DocumentId, tDataTransformed<Type>>> => {
  try {
    const q = query(firebaseColl(path, ...pathSegments), ...queries);
    const querySnapshot = await getDocs(q);
    return transformData<Type>(querySnapshot);
  } catch (err) {
    console.error(`Error when reading [${[path, ...pathSegments].join('/')}]:`, err);
    return {};
  }
}


export const fsReadOne = async <T extends any>(
  path: string,
  ...pathSegments: string[]
): Promise<tDataTransformed<T> | undefined> => {
  try {
    const docSnapshot = await getDoc(firebaseDoc(path, ...pathSegments));
    if (!docSnapshot.exists()) {
      return undefined;
    }
    return {
      data: docSnapshot.data() as T,
      _ref: docSnapshot.ref,
      _id: docSnapshot.id,
    };
  } catch (err) {
    throw err;
  }
};

// Firestore - update document
export const fsUpdate = async (
  data: DocumentData,
  path: string,
  ...pathSegments: string[]
): Promise<DocumentData | undefined> => {
  try {
    await setDoc(firebaseDoc(path, ...pathSegments), data, {
      merge: true,
    });
    return await fsReadOne(path, ...pathSegments);
  } catch (err) {
    throw err;
  }
}

export const fsRemove = async (
  path: string,
  ...pathSegments: string[]
): Promise<boolean | Error> => {
  try {
    await deleteDoc(firebaseDoc(path, ...pathSegments));
    return true;
  } catch (err) {
    throw err;
  }
}

export const fsRemoveByRef = async (ref: DocumentReference): Promise<boolean | Error> => {
  try {
    await deleteDoc(ref);
    return true;
  } catch (err) {
    throw err;
  }
}
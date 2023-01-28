import { User } from "firebase/auth";
import { DocumentReference, getDoc, getDocs } from "firebase/firestore";
import { tDataTransformed, tFirestoreQueryItemTransformedData, tUser } from "../../types/model";
import { fsAddWithId, fsReadOne, transformUser, transformUserD2O } from "../firestore"

const USER_ROOT_COLLECTION = 'users';
export const createUserIfNotExist = async (user: User): Promise<tDataTransformed<tUser> | undefined> => {
  try {
    const currentUser = await fsReadOne<tUser>(USER_ROOT_COLLECTION, user.uid);
    if (currentUser) {
      // Already exist
      return currentUser;
    }
    // Create a new one
    const newUser = await createUserByFirebaseAuth(user);
    if (!newUser) {
      console.error('Error when create new user for first login');
      return undefined;
    }
    return newUser;
  } catch (err: any) {
    console.error(`Error when create a new user if not exist with id("${user.uid}"):`, err);
    return undefined;
  }
}

export const createUserByFirebaseAuth = async (user: User): Promise<tDataTransformed<tUser> | undefined> => {
  try {
    const data = transformUserD2O(user);
    return await fsAddWithId<tUser>(data, user.uid, USER_ROOT_COLLECTION);
  } catch (err: any) {
    console.error(`Error when creating a new user after sign-in with firebase (UID=${user.uid}):`, err);
    throw err;
  }
}

export const getUsersByRefs = async (users: DocumentReference[]): Promise<Record<string, tDataTransformed<tUser>>> => {
  try {
    const res: Record<string, tDataTransformed<tUser>> = {};
    const data = (await Promise.all(users.map(async (user) => {
      try {
        const docSnapshot = await getDoc(user);
        if (!docSnapshot.exists()) {
          return undefined;
        }
        return {
          data: docSnapshot.data() as tUser,
          _ref: docSnapshot.ref,
          _id: docSnapshot.id,
        };
      } catch (userErr) {
        console.error('Error when get user information:', userErr);
        return undefined;
      }
    }))).filter(d => d) as tDataTransformed<tUser>[];

    data.forEach(d => {
      res[d._id] = d;
    })

    return res;
  } catch (err) {
    console.error('Error when getting a list of users from their DocRef:', err);
    return {};
  }
}
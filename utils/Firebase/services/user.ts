import { User } from "firebase/auth";
import { DocumentData } from "firebase/firestore"
import { DocumentId } from "../../types/model";
import { fsAddWithId, fsReadOne, transformUser } from "../firestore"

export const getUserIfExist = async (id: DocumentId): Promise<DocumentData | false> => {
  try {
    // const data = await fsReadOne('account', id);
    return false;
  } catch (err: any) {
    console.error(`Error when checking user exist with id("${id}"):`, err);
    return false;
  }
}

export const createUserByFirebaseAuth = async (user: User) => {
  try {
    const data = transformUser(user)
    return await fsAddWithId(data, user.uid, 'account');
  } catch (err: any) {
    console.error(`Error when creating a new user after sign-in with firebase (UID=${user.uid}):`, err);
    return false;
  }
}
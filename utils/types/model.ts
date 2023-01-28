import { DocumentReference, Timestamp } from "firebase/firestore";

export type DocumentId = DocumentReference['id'];

export type tShortenLink = {
  shortId: string;
  passCode: string | null;
  longLink: string;
  availableUntil: Timestamp | null;
}

export type tUser = {
  email: string | null;
  displayName: string;
  photoURL: string | null;
  joinedAt: Timestamp;
}

export type tActivityTracking = {
  name: string;
  code: string;
  createdBy: DocumentReference;
  participants: DocumentReference[];
  createdAt: Timestamp;
  startedAt: Timestamp;
  finishedAt: Timestamp;
}

export type tFirestoreQueryItemData<Type> = {
  data?: Type,
  errorMessageId?: string;
  isError?: boolean;
}
export type tFirestoreQueryItemTransformedData<Type> = {
  _id?: DocumentId,
  _ref?: DocumentReference;
  data?: Type,
  errorMessageId?: string;
  isError?: boolean;
}
export type tFirestoreQueryItemsData<Type> = {
  data?: Type[],
  errorMessageId?: string;
  isError?: boolean;
}
export type tFirestoreQueryItemsTransformedData<Type> = {
  data?: tDataTransformed<Type>[],
  errorMessageId?: string;
  isError?: boolean;
}

export type tDataTransformed<Type> = { data: Type, _id: DocumentId, _ref: DocumentReference };
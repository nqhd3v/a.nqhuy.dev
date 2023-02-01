import { DocumentReference } from "firebase/firestore";

export type tShortLinkD2O = {
  longLink: string;
  passCode?: string;
  expiredTime?: Date;
}

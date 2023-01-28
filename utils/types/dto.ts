import { DocumentReference } from "firebase/firestore";

export type tShortLinkD2O = {
  longLink: string;
  passCode?: string;
  expiredTime?: Date;
}

export type tActivityTrackingD20 = {
  name: string;
  time?: {
    start: Date;
    end: Date;
  };
  participants?: DocumentReference[];
}
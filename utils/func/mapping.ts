import { Timestamp } from "firebase/firestore";
import { DocumentId, tDataTransformed, tFirestoreQueryItemData } from "../types/model";

// Firestore - Timestamp utils
export const date2FsTimestamp = (date?: Date) => Timestamp.fromDate(date || new Date());
export const fsTimestamp2Date = (timestamp: Timestamp): Date | undefined => timestamp ? timestamp.toDate() : undefined;

export const fsArr2Dic = <T extends any>(arr: tDataTransformed<T>[]): Record<DocumentId, tDataTransformed<T>> => {
  const res: Record<DocumentId, tDataTransformed<any>> = {};
  arr.forEach(({ _id, ...data }) => {
    res[_id] = {
      ...data,
      _id,
    }
  });
  return res;
}

export const firstDataTransformedItem = <T extends any>(record: Record<DocumentId, tDataTransformed<T>>): tDataTransformed<T> | undefined => {
  if (Object.keys(record).length === 0) return undefined;
  return record[Object.keys(record)[0]];
}

export const errorQuery = <T extends any>(rootLocale: string) => (messageId: string = 'notfound'): tFirestoreQueryItemData<T> => {
  return {
    isError: true,
    errorMessageId: `${rootLocale}.${messageId}`,
  };
}

export const mapLength = (mapping: Record<string, any>, deep?: boolean): number => Object.keys(mapping).filter(k => {
  if (deep) {
    if (Array.isArray(mapping[k])) {
      return mapping[k].length > 0 ? mapping[k] : undefined;
    }
    if (mapping[k] instanceof Object) {
      return mapLength(mapping[k], deep) > 0 ? mapping[k] : undefined;
    }
  }
  return mapping[k]
}).length;

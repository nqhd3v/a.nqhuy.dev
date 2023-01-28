import { DocumentReference, getDoc, orderBy, setDoc, where } from "firebase/firestore";
import { date2FsTimestamp } from "../../func/mapping";
import { randomStr } from "../../func/random";
import { tActivityTrackingD20 } from "../../types/dto";
import { tActivityTracking, tDataTransformed, tFirestoreQueryItemsTransformedData, tFirestoreQueryItemTransformedData, tUser } from "../../types/model";
import { fsAdd, fsReadArrWithCond } from "../firestore";

const ACTIVITY_TRACKING_ROOT_COLLECTION = "activity_trackings";

export const createActivity = async (name: string, user: tDataTransformed<tUser>): Promise<tFirestoreQueryItemTransformedData<tActivityTracking>> => {
  try {
    if (!name || !user) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.invalid-input',
      };
    }
    const data = await fsAdd<tActivityTracking>({
      name: name.trim(),
      code: randomStr(6),
      createdBy: user._ref,
      participants: [user._ref],
      createdAt: date2FsTimestamp(),
    }, ACTIVITY_TRACKING_ROOT_COLLECTION);
    if (!data) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.create.unknown',
      }
    }
    return data;
  } catch (err) {
    console.error('Error when creating a new activity:', err);
    return {
      isError: true,
      errorMessageId: 'exception.activityTracking.create.unknown',
    }
  }
}

export const getActivities = async (user: tDataTransformed<tUser>): Promise<tFirestoreQueryItemsTransformedData<tActivityTracking>> => {
  try {
    const data = await fsReadArrWithCond<tActivityTracking>(
      [
        where('participants', 'array-contains' , user._ref),
        orderBy('createdAt', 'desc'),
        orderBy('name', 'asc'),
      ],
      ACTIVITY_TRACKING_ROOT_COLLECTION,
    );
    return {
      data,
    }
  } catch (err) {
    console.error('Error when getting activities:', err);
    return {
      isError: true,
      errorMessageId: 'exception.activityTracking.fetch.unknown',
    }
  }
}

export const getActivityByCode = async (code: string, user: tDataTransformed<tUser>): Promise<tFirestoreQueryItemTransformedData<tActivityTracking> | undefined> => {
  try {
    const data = await fsReadArrWithCond<tActivityTracking>(
      [
        where('code', '==', code),
        where('participants', 'array-contains' , user._ref),
        orderBy('createdAt', 'desc'),
        orderBy('name', 'asc'),
      ],
      ACTIVITY_TRACKING_ROOT_COLLECTION,
    );
    if (data.length === 0) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.notfound',
      };
    }
    return data[0];
  } catch (err) {
    console.error('Error when getting activities:', err);
    return {
      isError: true,
      errorMessageId: 'exception.activityTracking.fetch.unknown',
    }
  }
}

export const joinActivityByCode = async (code: string, user: tDataTransformed<tUser>): Promise<tFirestoreQueryItemTransformedData<tActivityTracking>> => {
  try {
    if (!code || !user) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.join.invalid-input',
      };
    }
    const data = await fsReadArrWithCond<tActivityTracking>(
      [ where('code', '==', code) ],
      ACTIVITY_TRACKING_ROOT_COLLECTION,
    );
    if (data.length === 0) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.join.notfound',
      };
    }
    if (data[0].data.participants.includes(user._ref)) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.join.joined',
      }
    }
    const newParticipants = [...data[0].data.participants, user._ref];
    await setDoc(
      data[0]._ref,
      { participants: newParticipants },
      { merge: true },
    );
    const res = await getActivityByCode(code, user);
    if (!res) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.join.unknown',
      };
    }
    return res;
  } catch (err) {
    console.error('Error when joining a new activity:', err);
    return {
      isError: true,
      errorMessageId: 'exception.activityTracking.join.unknown',
    }
  }
}

export const updateActivity = async (ref: DocumentReference, data: tActivityTrackingD20): Promise<tFirestoreQueryItemTransformedData<tActivityTracking>> => {
  try {
    if (!ref || !data.name || !data.name || (data.time?.start && !data.time?.end) || (!data.time?.start && data.time?.end)) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.update.invalid-input',
      };
    }
    const currentActivity = await getDoc(ref);
    if (!currentActivity.exists()) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.update.notfound'
      }
    }
    // const currentActivityData = currentActivity.data() as tActivityTracking;
    const dataNeedUpdate = data.time
      ? { name: data.name, startedAt: date2FsTimestamp(data.time.start), finishedAt: date2FsTimestamp(data.time.end) }
      : { name: data.name };
    await setDoc(
      ref,
      dataNeedUpdate,
      { merge: true },
    );
    const res = await getDoc(ref);
    if (!res || !res.exists()) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.update.unknown',
      };
    }
    return {
      data: res.data() as tActivityTracking,
      _id: res.id,
      _ref: res.ref,
    };
  } catch (err) {
    console.error('Error when updating an activity:', err);
    return {
      isError: true,
      errorMessageId: 'exception.activityTracking.update.unknown',
    }
  }
}

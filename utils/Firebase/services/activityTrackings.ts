import { DocumentReference, getDoc, orderBy, setDoc, where } from "firebase/firestore";
import { boolRes, date2FsTimestamp } from "../../func/mapping";
import { randomStr } from "../../func/random";
import { tActivityAction, tActivityTracking, tActivityTrackingUpdate, tDataTransformed, tFirestoreQueryItemsTransformedData, tFirestoreQueryItemTransformedData, tUser } from "../../types/model";
import { fsAdd, fsReadArrWithCond, joinRefList } from "../firestore";

export const fsActivityTrackingPath = "activity_trackings";

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
      checkInAvailable: false,
      participantsCheckedIn: [],
    }, fsActivityTrackingPath);
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
      fsActivityTrackingPath,
    );
    return {
      data,
    }
  } catch (err) {
    console.error('Error when getting activities:', err);
    return {
      isError: true,
      errorMessageId: 'exception.activityTracking.get.unknown',
    }
  }
}

export const getActivityByCode = async (code: string, user: tDataTransformed<tUser>, forJoined = true): Promise<tFirestoreQueryItemTransformedData<tActivityTracking> | undefined> => {
  try {
    const data = await fsReadArrWithCond<tActivityTracking>(
      forJoined ? [
        where('code', '==', code),
        where('participants', 'array-contains' , user._ref),
        orderBy('createdAt', 'desc'),
        orderBy('name', 'asc'),
      ] : [ where('code', '==', code) ],
      fsActivityTrackingPath,
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
      errorMessageId: 'exception.activityTracking.get.unknown',
    }
  }
}

export const joinActivityByCode = async (code: string, user: tDataTransformed<tUser>, skipJoined?: boolean): Promise<tFirestoreQueryItemTransformedData<tActivityTracking>> => {
  try {
    if (!code || !user) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.invalid-input',
      };
    }
    const data = await fsReadArrWithCond<tActivityTracking>(
      [ where('code', '==', code) ],
      fsActivityTrackingPath,
    );
    if (data.length === 0) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.join.notfound',
      };
    }
    if (data[0].data.participants.map(p => p.path).includes(user._ref.path)) {
      if (skipJoined) {
        return data[0];
      }
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

export const updateActivity = async (ref: DocumentReference, data: Partial<tActivityTrackingUpdate>): Promise<tFirestoreQueryItemTransformedData<tActivityTracking>> => {
  try {
    if (!ref || (data.time?.start && !data.time?.end) || (!data.time?.start && data.time?.end)) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.invalid-input',
      };
    }
    const currentActivity = await getDoc(ref);
    if (!currentActivity.exists()) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.update.notfound'
      }
    }
    const currentActivityData = currentActivity.data() as tActivityTracking;
    const dataNeedUpdate = {
      name: data.name || currentActivityData.name,
      startedAt: data.time ? date2FsTimestamp(data.time.start) : (currentActivityData.startedAt || null),
      finishedAt: data.time ? date2FsTimestamp(data.time.end) : (currentActivityData.finishedAt || null),
      participants: joinRefList(currentActivityData.participants, ...(data.participants || [])),
      participantsCheckedIn: joinRefList(currentActivityData.participantsCheckedIn, ...(data.participantsCheckedIn || [])),
      actions: [...(currentActivityData.actions || []), ...(data.actions || [])],
      checkInAvailable: boolRes(data.checkInAvailable, currentActivityData.checkInAvailable),
    };
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

export const updateCheckInState = async (ref: DocumentReference, isOpen = true): Promise<tFirestoreQueryItemTransformedData<tActivityTracking>> => {
  try {
    return await updateActivity(ref, { checkInAvailable: isOpen })
  } catch (err) {
    console.error('Error when updating check-in state for an activity:', err);
    return {
      isError: true,
      errorMessageId: 'exception.activityTracking.update.unknown',
    }
  }
}

export const checkIn = async (ref: DocumentReference, userRef: DocumentReference): Promise<tFirestoreQueryItemTransformedData<tActivityTracking>> => {
  try {
    return await updateActivity(ref, { participantsCheckedIn: [userRef] });
  } catch (err) {
    console.error('Error when handling check-in for an activity:', err);
    return {
      isError: true,
      errorMessageId: 'exception.activityTracking.update.unknown',
    }
  }
}

export const addAction = async (ref: DocumentReference, type: tActivityAction, actionRef: DocumentReference): Promise<tFirestoreQueryItemTransformedData<tActivityTracking>> => {
  try {
    return await updateActivity(ref, { actions: [{ type, ref: actionRef }] });
  } catch (err) {
    console.error('Error when trying to re-update activity after created a new action:', err);
    return {
      isError: true,
      errorMessageId: `exception.activityTracking.addOns.${type}.created_activity.update.unknown`,
    }
  }
}


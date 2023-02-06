import { DocumentReference, getDoc, setDoc } from "firebase/firestore";
import { date2FsTimestamp } from "../../func/mapping";
import { tActivityAction, tActivityActions, tActivityPoll, tActivityTracking, tDataTransformed, tFirestoreQueryItemsTransformedData, tFirestoreQueryItemTransformedData } from "../../types/model";
import { fsAdd, fsReadByRefs, isIncludedRef } from "../firestore";

export const createActivityPoll = async (
  activity: DocumentReference,
  user: DocumentReference,
  { question, options }: { question: string, options: string[] }
): Promise<tFirestoreQueryItemTransformedData<tActivityPoll>> => {
  try {
    if (!activity || !user || !question || !Array.isArray(options) || options.length === 0) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.invalid-input',
      };
    }
    const data = await fsAdd<tActivityPoll>({
      question,
      options: options.map(o => ({ content: o, selected: [] })),
      createdAt: date2FsTimestamp(),
      updatedAt: date2FsTimestamp(),
      createdBy: user,
      isClosed: false,
    }, `${activity.path}/addOns`);
    if (!data) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.addOns.poll.create.unknown',
      }
    }
    return data;
  } catch (err) {
    console.error(`Error when creating a new poll for activity [id = ${activity.id}]:`, err);
    return {
      isError: true,
      errorMessageId: 'exception.activityTracking.addOns.poll.create.unknown',
    }
  }
}

export type tActivityActionsWithType =
  { type: "poll", data: tDataTransformed<tActivityPoll> | undefined};
  
export type tActionMapping4Activity = Record<string, tActivityActionsWithType>;
export const getActions4ActivityByRefs = async (
  actions: tActivityTracking['actions']
): Promise<tActionMapping4Activity> => {
  try {
    const res: tActionMapping4Activity = {};
    actions.forEach(a => {
      res[a.ref.path] = {
        type: a.type,
        data: undefined,
      }
    });
    const refs = actions.map(a => a.ref);
    const actionData = await fsReadByRefs<tActivityActions>(refs);
    actionData.forEach(a => {
      if (!a._id || !a.data || !a._ref) {
        return;
      }
      res[a._ref.path] = {
        ...res[a._ref.path],
        data: {
          data: a.data,
          _id: a._id,
          _ref: a._ref,
        },
      };
    });
    return res;
  } catch (err) {
    console.error(`Error when getting the list of add-ons for activity:`, err);
    return {};
  }
}
export const selectPollOption = async (pollRef: DocumentReference, selected: number, userRef: DocumentReference): Promise<tFirestoreQueryItemTransformedData<tActivityPoll>> => {
  try {
    const currentPoll = await getDoc(pollRef);
    if (!currentPoll.exists()) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.addOns.poll.update.notfound'
      };
    }
    const currentPollData = currentPoll.data() as tActivityPoll;
    const newOptions = currentPollData.options.map((o, i) => {
      if (i === selected) {
        const newSelected = isIncludedRef(userRef, o.selected)
          ? o.selected
          : [...o.selected, userRef];
        return {
          ...o,
          selected: newSelected,
        }
      }
      return o;
    });
    await setDoc(
      pollRef,
      { options: newOptions },
      { merge: true },
    );
    const res = await getDoc(pollRef);
    if (!res || !res.exists()) {
      return {
        isError: true,
        errorMessageId: 'exception.activityTracking.addOns.poll.select-option.unknown',
      };
    }
    return {
      data: res.data() as tActivityPoll,
      _id: res.id,
      _ref: res.ref,
    };
  } catch (err) {
    console.error(`Error when select an option for poll [id = ${pollRef.id}]:`, err);
    return {
      isError: true,
      errorMessageId: 'exception.activityTracking.addOns.poll.select-option.unknown',
    };
  }
}
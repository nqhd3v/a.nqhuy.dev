import { onSnapshot } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { includedRef, isIncludedRef } from "../../../utils/Firebase/firestore";
import { selectPollOption } from "../../../utils/Firebase/services/activityAddOns";
import { tActivityPoll, tActivityPollOption, tDataTransformed, tUser } from "../../../utils/types/model";
import { useFirebaseAuth } from "../../Firebase/FirebaseAuthWrapper";

interface iPoll {
  data: tDataTransformed<tActivityPoll>;
  userMapping: Record<string, tDataTransformed<tUser>>;
  onDataChange?: (newData: tDataTransformed<tActivityPoll>) => void;
}
const Poll: React.FC<iPoll> = ({ data, onDataChange, userMapping }) => {
  const optionKeys = useMemo(() => data.data.options.map((_, i) => i), [data.data.options]);
  const { user } = useFirebaseAuth();
  const pollOptionSelected = useMemo(() => {
    if (!user) return false;
    const userFinished = data.data.options.map(o => o.selected);
    return includedRef(user._ref, ...userFinished) ;
  }, [user, data.data.options]);
  const pollOptionSelectRatio = useMemo(() => {
    const totalSelected = data.data.options.map(o => o.selected.length).reduce((a, b) => a + b, 0);
    return data.data.options.map(o => o.selected.length / totalSelected);
  }, [data.data.options]);
  const [selecting, setSelecting] = useState<boolean>(false);

  useEffect(() => {
    const unSub = onSnapshot(data._ref, (pollSnapshot) => {
      if (!pollSnapshot.exists()) {
        unSub();
        return;
      }
      onDataChange?.({
        data: pollSnapshot.data() as tActivityPoll,
        _id: pollSnapshot.id,
        _ref: pollSnapshot.ref,
      });
    })

    return () => unSub();
  }, []);

  const handleSelectOption = async (i: number) => {
    if (!user) {
      return;
    }
    setSelecting(true);
    await selectPollOption(data._ref, i, user._ref);
    setSelecting(false);
  }

  return (
    <div className="w-full border border-gray-400 dark:border-gray-600 rounded-md p-5">
      <div className="code comment text-sm">{userMapping[data.data.createdBy.id]?.data.displayName || 'Someone'} created a new poll:</div>
      <div className="code text-xl font-bold mb-3">
        <span className="var">question</span>
        {' = '}
        <span className="str">{data.data.question}</span>
      </div>
      <div className="flex flex-col space-y-2">
        {optionKeys.map((k, i) => (
          <PollOption
            key={k}
            data={data.data.options[k]}
            selectable={pollOptionSelected < 0}
            onSelect={() => handleSelectOption(k)}
            disabled={selecting || pollOptionSelected < 0}
            selected={pollOptionSelected === i}
            ratio={pollOptionSelectRatio[i]}
          />
        ))}
      </div>
    </div>
  )
}

const PollOption: React.FC<{
  data: tActivityPollOption,
  selectable: boolean,
  onSelect: () => Promise<void> | void;
  selected?: boolean;
  disabled?: boolean;
  ratio: number;
}> = ({ data, selectable, disabled, selected, ratio, onSelect }) => {
  if (selectable) {
    return (
      <div
        className={
          "border border-gray-400 dark:border-gray-600 " +
          "rounded px-5 py-2 relative " +
          "" +
          (disabled ? "cursor-not-allowed opacity-30 " : "cursor-pointer duration-300 hover:bg-light/30 dark:hover:bg-dark-800 ")
        }
        onClick={() => disabled ? null : onSelect()}
      >
        {data.content}
      </div>
    )
  }
  return (
    <div
      className={
        "border rounded px-5 py-2 relative font-bold " +
        (selected ? "border-blue-600 dark:border-blue-500 " : "border-gray-400 dark:border-gray-600 ")
      }
    >
      <div
        className={
          "absolute left-0 top-0 bottom-0 right-auto w-full h-full origin-top-left -z-[1] " +
          (selected ? "bg-blue-300 dark:bg-blue-800 " : "bg-gray-300 dark:bg-gray-700 ")
        }
        style={{ transform: `scaleX(${ratio})`}}
      />
      {data.content}
      <div className="absolute right-2 bottom-0 top-1/2 -translate-y-1/2 text-base font-bold italic text-gray-500 dark:text-gray-400">{ratio * 100}%</div>
    </div>
  )
}

export default Poll;
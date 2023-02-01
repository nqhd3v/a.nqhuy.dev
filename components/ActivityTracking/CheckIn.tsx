import { DocumentReference } from "firebase/firestore";
import { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";
import { checkIn, updateCheckInState } from "../../utils/Firebase/services/activityTrackings";
import useMessage from "../../utils/international";
import { tActivityTracking, tDataTransformed, tUser } from "../../utils/types/model";
import Button from "../Button";
import { useFirebaseAuth } from "../Firebase/FirebaseAuthWrapper";

interface iCheckIn {
  data: DocumentReference[];
  activityRef?: DocumentReference;
  fetching: boolean;
  isOwner: boolean;
  isAllowCheckIn: boolean;
  onStarted?: () => Promise<void> | void;
  onFinished?: () => Promise<void> | void;
}
const CheckIn: React.FC<iCheckIn> = ({ data, activityRef, fetching, isOwner, isAllowCheckIn, onStarted, onFinished }) => {
  const { user } = useFirebaseAuth();
  const isCheckedIn = useMemo(() => {
    if (!user) return false;
    return data.map(p => p.path).includes(user._ref.path);
  }, [!data, !user, (data || []).map(p => p.path).join()])
  const { message } = useMessage();
  const [error, setError] = useState<string | undefined>(undefined);
  const [starting, setStarting] = useState<boolean>(false);
  const [finishing, setFinishing] = useState<boolean>(false);
  const [checkingIn, setCheckingIn] = useState<boolean>(false);

  const handleStart = async () => {
    if (!activityRef) {
      return;
    }
    setStarting(true);
    const res = await updateCheckInState(activityRef, true);
    if (res.isError || !res.data) {
      setError(res.errorMessageId || 'exception.activityTracking.checkIn.unknown');
      return;
    }
    setError(undefined);
    setStarting(false);
    setCheckingIn(true);
    await onStarted?.();
  }
  const handleFinish = async () => {
    if (!activityRef) {
      return;
    }
    setFinishing(true);
    const res = await updateCheckInState(activityRef, false);
    if (res.isError || !res.data) {
      setError(res.errorMessageId || 'exception.activityTracking.checkIn.unknown');
      return;
    }
    setError(undefined);
    setFinishing(false);
    setCheckingIn(false);
    await onFinished?.();
  }

  const handleCheckIn = async () => {
    if (!activityRef || !user) {
      return;
    }
    setCheckingIn(true);
    const res = await checkIn(activityRef, user._ref);
    if (res.isError || !res.data) {
      setError(res.errorMessageId || 'exception.activityTracking.checkIn.unknown');
      setCheckingIn(false);
      return;
    }
    setError(undefined);
    setCheckingIn(false);
  }

  const handleCheckInClick = async () => {
    if (fetching) {
      return;
    }
    if (isOwner && !isAllowCheckIn) {
      // Handle start
      await handleStart();
      return;
    }
    if (isOwner && isAllowCheckIn) {
      // Handle finish
      await handleFinish();
      return;
    }
    if (isAllowCheckIn) {
      // Handle check-in
      await handleCheckIn();
    }
    // No action
    return;
  }

  const btnMsg = () => {
    if (isOwner && starting) {
      return message('activityTracking.checkIn.run.starting');
    }
    if (isOwner && finishing) {
      return message('activityTracking.checkIn.run.finishing');
    }
    if (isOwner && isAllowCheckIn) {
      return message('activityTracking.checkIn.run.finish');
    }
    if (isOwner) {
      return message('activityTracking.checkIn.run.start');
    }
    if (checkingIn) {
      return message('activityTracking.checkIn.run.checking');
    }
    if (isCheckedIn) {
      // Checked-in
      return message('activityTracking.checkIn.checked');
    }
    return message('activityTracking.checkIn.run');
  }

  return (
    <div className="w-full border border-gray-400 dark:border-gray-600 rounded-md">
      <div className="flex flex-col sm:flex-row items-center p-5">
        <div className="w-full flex items-center mb-2 sm:w-auto sm:mb-0 sm:mr-auto">
          <Button
            className="w-[calc(100%-40px)] sm:w-auto sm:b-0"
            onClick={handleCheckInClick} disabled={isCheckedIn || fetching || !data}
          >
            {btnMsg()}
          </Button>
          {(isOwner && activityRef) ? (
            <div
              className="w-8 h-8 ml-2 rounded cursor-pointer border border-dashed border-gray-500 dark:border-gray-700 flex justify-center items-center text-base hover:text-xl duration-300"
              onClick={() => onStarted?.()}
            >
              <i className="fas fa-expand" />
            </div>
          ) : null}
        </div>
        
        <div className="font-bold text-gray-400 dark:text-gray-600 italic">
          {isCheckedIn
            ? message('activityTracking.checkIn.count-with-me', { count: data.length - 1 })
            : message('activityTracking.checkIn.count', { count: data.length })
          }
        </div>
      </div>
      {error ? <div className="code comment mb-5 px-5">{'Error'}{message(error)}</div> : null}
    </div>
  )
}

export default CheckIn;
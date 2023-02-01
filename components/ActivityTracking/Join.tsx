import { useRouter } from "next/router";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { joinActivityByCode } from "../../utils/Firebase/services/activityTrackings";
import { tDataTransformed, tUser } from "../../utils/types/model";
import { useFirebaseAuth } from "../Firebase/FirebaseAuthWrapper";
import Form from "../Form";
import useForm from "../Form/useForm";
import InputWithButton from "../InputWithButton";
import ErrorBoundary from "../wrapper/ErrorBoundary";

interface iJoinActivityCard {
  className?: string;
  disabled?: boolean;
  goToDetailAfterJoined?: boolean;
  onRefreshActivities?: () => Promise<void> | void;
}
/**
 * Join activity card
 * 
 * `goToDetailAfterJoin` -> Pass this prop, to go to detail page after create success
 * `onRefreshActivities`   -> Pass this prop, to refresh data after create success
 * 
 * @param {iJoinActivityCard} props  
 * @returns {React.FC}
 */
const JoinActivityCard: React.FC<iJoinActivityCard> = ({ className, disabled, goToDetailAfterJoined, onRefreshActivities }) => {
  const form = useForm();
  const { user } = useFirebaseAuth();
  const router = useRouter();
  const [joining, setJoining] = useState<boolean>(false);

  const handleJoin = async ({ code }: any) => {
    setJoining(true);
    const res = await joinActivityByCode(code, user as tDataTransformed<tUser>);
    if (res.isError || !res.data) {
      form.setFieldError('code', [res.errorMessageId || 'exception.activityTracking.join.unknown'])
      setJoining(false);
      return;
    }
    form.reset();
    await onRefreshActivities?.();
    
    setJoining(false);
    if (goToDetailAfterJoined) {
      router.push(`/a/${res.data.code}`)
    }
  }

  return (
    <ErrorBoundary>
      <div className={`w-full rounded-md border border-gray-400 dark:border-gray-600 p-5 ${className || ''}`}>
        <div className="code text-2xl font-bold">
          <span className="var">a</span>
          {'.'}
          <span className="func">join</span>
          {'()'}
        </div>
        <div className="code comment text-sm mb-2">
          <FormattedMessage id="activityTracking.join.sub-tit" />
        </div>
        <Form onFinish={handleJoin} form={form}>
          <InputWithButton
            placeholder="activity_code ="
            name="code"
            rules={[{ required: true }]}
            hideErrorMessage
            appendIcon={joining ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-ellipsis"></i>}
            disabled={disabled}
          />
        </Form>
      </div>
    </ErrorBoundary>
  )
};

export default JoinActivityCard;
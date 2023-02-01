import { useRouter } from "next/router";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { createActivity } from "../../utils/Firebase/services/activityTrackings";
import { tDataTransformed, tUser } from "../../utils/types/model";
import { useFirebaseAuth } from "../Firebase/FirebaseAuthWrapper";
import Form from "../Form";
import useForm from "../Form/useForm";
import InputWithButton from "../InputWithButton";
import { withBoundary } from "../wrapper/ErrorBoundary";

interface iCreateActivityCard {
  className?: string;
  disabled?: boolean;
  goToDetailAfterCreated?: boolean;
  onRefreshActivities?: () => Promise<void> | void;
}
/**
 * Create activity card
 * 
 * `goToDetailAfterCreate` -> Pass this prop, to go to detail page after create success
 * `onRefreshActivities`   -> Pass this prop, to refresh data after create success
 * 
 * @param {iCreateActivityCard} props  
 * @returns {React.FC}
 */
const CreateActivityCard: React.FC<iCreateActivityCard> = ({ className, disabled, goToDetailAfterCreated, onRefreshActivities }) => {
  const form = useForm();
  const { user } = useFirebaseAuth();
  const router = useRouter();
  const [creating, setCreating] = useState<boolean>(false);

  const handleCreate = async ({ name }: any) => {
    setCreating(true);
    const res = await createActivity(name, user as tDataTransformed<tUser>);
    if (res.isError || !res.data) {
      form.setFieldError('name', [res.errorMessageId || 'exception.activityTracking.create.unknown'])
      setCreating(false);
      return;
    }
    form.reset();
    await onRefreshActivities?.();
    
    setCreating(false);
    if (goToDetailAfterCreated) {
      router.push(`/a/${res.data.code}`)
    }
  }

  return (
    <div className={`w-full rounded-md border border-gray-400 dark:border-gray-600 p-5 ${className || ''}`}>
      <div className="code text-2xl font-bold">
        <span className="var">a</span>
        {'.'}
        <span className="func">create</span>
        {'()'}
      </div>
      <div className="code comment text-sm mb-2">
        <FormattedMessage id="activityTracking.create.sub-tit" />
      </div>
      <Form onFinish={handleCreate} form={form}>
        <InputWithButton
          placeholder="activity_name ="
          name="name"
          rules={[{ required: true }]}
          hideErrorMessage
          appendIcon={creating ? <i className="fa-solid fa-spinner fa-spin" /> : <i className="fa-solid fa-ellipsis"></i>}
          disabled={disabled}
        />
      </Form>
    </div>
  )
};

export default withBoundary(CreateActivityCard);
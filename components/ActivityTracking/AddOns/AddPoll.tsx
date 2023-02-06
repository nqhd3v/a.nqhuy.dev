import { DocumentReference } from "firebase/firestore";
import { useReducer } from "react";
import { createActivityPoll } from "../../../utils/Firebase/services/activityAddOns";
import { addAction } from "../../../utils/Firebase/services/activityTrackings";
import useMessage from "../../../utils/international";
import Button from "../../Button";
import { useFirebaseAuth } from "../../Firebase/FirebaseAuthWrapper";
import Form, { Input, ListInput, useForm } from "../../Form";

interface iAddPollForm {
  data?: Record<string, any>;
  onCloseModal?: () => void;
}
type tAddOnsState = {
  creating: boolean;
  error: string | undefined;
}
const AddPollForm: React.FC<iAddPollForm> = ({ data, onCloseModal }) => {
  const [{ creating, error }, setState] = useReducer((f: tAddOnsState, s: Partial<tAddOnsState>) => ({ ...f, ...s }), { creating: false, error: undefined });
  const form = useForm();
  const { user } = useFirebaseAuth();
  const { message } = useMessage();

  const handleSaveNewPoll = async ({ question, options }: any) => {
    if (!user || !data || !data.activityRef) {
      setState({ error: 'exception.activityTracking.invalid-input' });
      return;
    }
    const { activityRef } = data;
    setState({ creating: true });
    const res = await createActivityPoll(activityRef, user._ref, { question, options });
    if (res.isError || !res.data) {
      setState({
        error: res.errorMessageId || 'exception.activityTracking.addOns.poll.create.unknown',
        creating: false,
      });
      return;
    }
    const resUpdateActivity = await addAction(activityRef, "poll", res._ref as DocumentReference);
    if (resUpdateActivity.isError || !resUpdateActivity.data) {
      setState({
        error: res.errorMessageId || 'exception.activityTracking.addOns.poll.created_activity.update.unknown',
        creating: false,
      });
      return;
    }
    setState({ creating: false });
    form.reset();
    onCloseModal?.();
  }

  return (
    <div className="relative rounded p-5 w-full h-full bg-light dark:bg-dark-800">
      <div className="font-bold text-2xl code">
        <span className="var">p</span>
        {' = '}
        <span className="var">a</span>
        {'.'}
        <span className="func">addOns</span>
        {'('}
        <span className="str">Poll</span>
        {')'}
      </div>
      <div className="code comment mb-5">{message('activityTracking.addOns.poll.desc')}</div>
      <Form onFinish={handleSaveNewPoll} form={form} disabled={creating}>
        <Input
          name="question"
          placeholder="question ="
          className="mb-5"
          rules={[{ required: true, message: 'exception.activityTracking.addOns.poll.require-question' }]}
        />
        <ListInput
          name="options"
          placeholder="options"
          className="mb-5"
          rules={[{ required: true, message: 'exception.activityTracking.addOns.poll.require-options' }]}
        />
        <Button className="code">
          <span className="var">p</span>
          {'.'}
          <span className="func">save</span>
          {'()'}
        </Button>
      </Form>
      {error ? <div className="code comment">{message(error)}</div> : null}
    </div>
  );
}

export default AddPollForm;

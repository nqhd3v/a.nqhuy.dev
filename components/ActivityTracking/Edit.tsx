import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { updateActivity } from "../../utils/Firebase/services/activityTrackings";
import { fsTimestamp2Date } from "../../utils/func/mapping";
import { DocumentId, tActivityTracking, tDataTransformed } from "../../utils/types/model";
import Button from "../Button";
import Form, { useForm, Input, InputDateRange } from "../Form";

interface iEditActivity {
  data?: tDataTransformed<tActivityTracking>;
  onDone?: (newData: tDataTransformed<tActivityTracking>) => Promise<void> | void;
}
const EditActivity: React.FC<iEditActivity> = ({ data, onDone }) => {
  const form = useForm();
  const [error, setError] = useState<string | undefined>(undefined);
  const [updating, setUpdating] = useState<boolean>(false);

  const handleSubmit = async ({ name, time }: any) => {
    if (!data) {
      setError('exception.activityTracking.update.unknown');
      return;
    }
    if ((!time.start && time.end) || (time.start && !time.end)) {
      form.setFieldError('time', ['exception.activityTracking.form.time.require-or-empty-together']);
      return;
    }
    setUpdating(true);
    const res = await updateActivity(data._ref, {
      name,
      time,
    });
    if (res.isError || !res.data) {
      setError(res.errorMessageId || 'exception.activityTracking.update.unknown');
      setUpdating(false);
      return;
    }
    await onDone?.({
      data: res.data as tActivityTracking,
      _id: res._id as DocumentId,
      _ref: data._ref,
    });
    setUpdating(false);
  }

  if (!data) {
    return (
      <div className="code comment">unknown data to edit</div>
    )
  }
  return (
    <div className="px-5">
      <Form
        initialValues={{
          name: data.data.name,
          time: {
            start: fsTimestamp2Date(data.data.startedAt),
            end: fsTimestamp2Date(data.data.finishedAt),
          }
        }}
        onFinish={handleSubmit}
        form={form}
      >
        <Input
          name="name"
          placeholder="activity_name ="
          rules={[{ required: true }]}
          hideErrorMessage
          className="mb-4"
          disabled={updating}
        />
        <InputDateRange
          name="time"
          label="Activity time:"
          start={{ placeholderText: 'start_time =', dateFormat: 'dd/MM/yyyy HH:mm', showTimeSelect: true }}
          end={{ placeholderText: 'end_time =', dateFormat: 'dd/MM/yyyy HH:mm', showTimeSelect: true }}
          className="mb-4"
          disabled={updating}
        />
        <Button disabled={updating}>
          {updating ? <i className="fas fa-spinner fa-spin mr-2" /> : ""}
          save
        </Button>
      </Form>
      {error ? (
        <div className="code comment">
          <b>{'Error: '}</b>
          <FormattedMessage id={error} />
        </div>
      ) : null}
    </div>
  )
};

export default EditActivity;
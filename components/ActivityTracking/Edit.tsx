import { useState } from "react";
import { updateActivity } from "../../utils/Firebase/services/activityTrackings";
import { fsTimestamp2Date } from "../../utils/func/mapping";
import { DocumentId, tActivityTracking, tDataTransformed } from "../../utils/types/model";
import Button from "../Button";
import Form from "../Form";
import useForm from "../Form/useForm";
import Input from "../Input";
import InputDateRange from "../InputDateRange";

interface iEditActivity {
  data?: tDataTransformed<tActivityTracking>;
  onReUpdateData?: (newData: tDataTransformed<tActivityTracking>) => Promise<void> | void;
}
const EditActivity: React.FC<iEditActivity> = ({ data, onReUpdateData }) => {
  const form = useForm();
  const [error, setError] = useState<string | undefined>(undefined);
  const [updating, setUpdating] = useState<boolean>(false);

  const handleSubmit = async ({ name, time }: any) => {
    if (!data) {
      console.error('Something went wrong when handle update activity!');
      return;
    }
    if ((!time.start && time.end) || (time.start && !time.end)) {
      form.setFieldError('time', ['This both field have to emptied, or filled together!']);
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
    await onReUpdateData?.({
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
          {error}
        </div>
      ) : null}
    </div>
  )
};

export default EditActivity;
import { forwardRef, useEffect, useReducer } from "react";
import DatePicker, { ReactDatePickerProps } from "react-datepicker"
import InputError from "./FormInputError";
import { tFormRule } from "./types";

const CustomInput = forwardRef((props: any, ref: any) => {
  return (
    <input {...props} ref={ref} />
  )
});
CustomInput.displayName = 'InputDateRangeInp';

interface iLocalData {
  start: Date | undefined;
  end: Date | undefined;
}
interface iInputDateRangeDate extends Omit<ReactDatePickerProps, 'onChange'> {
  onChange?: ReactDatePickerProps['onChange'];
}
interface iInputDateRange {
  name: string;
  label?: string;
  value?: iLocalData;
  errors?: string[];
  start?: iInputDateRangeDate;
  end?: iInputDateRangeDate;
  rules?: tFormRule[];
  onChange?: (dates: iLocalData) => void;
  hideErrorMessage?: boolean;
  className?: string;
  disabled?: boolean;
}
const InputDateRange: React.FC<iInputDateRange> = ({ value, label, onChange, start, end, className, errors, hideErrorMessage, disabled }) => {
  const [localData, setLocalData] = useReducer((prev: iLocalData, next: Partial<iLocalData>) => {
    const start = next.start || prev.start;
    const end = next.end || prev.end;

    if (start && end && (start > end)) {
      next.end = start;
      next.start = end;
    }

    return {
      start: next.start || prev.start,
      end: next.end || prev.end,
    }
  }, {
    start: value?.start,
    end: value?.end,
  });

  useEffect(() => {
    // Re-update local if difference with global
    if ((!localData && value) || value?.start !== localData.start || value?.end !== localData.end) {
      setLocalData({
        start: value?.start,
        end: value?.end,
      });
    }
  }, [value])
  useEffect(() => {
    // Re-update local if difference with global
    if ((!value && localData) || value?.start !== localData.start || value?.end !== localData.end) {
      onChange?.(localData);
    }
  }, [localData]);

  return (
    <div className={"w-full " + (className || '')}>
      {label ? (
        <div className="code comment">{label}</div>
      ) : null}
      <div className="flex items-center space-x-2">
        <DatePicker
          {...(start || {})}
          customInput={<CustomInput disabled={disabled} data-error={(errors || []).length > 0 ? true : false} />}
          selected={localData.start}
          onChange={(d) => setLocalData({ start: d as (Date | null) || undefined })}
          className={
            "text-dark dark:text-light "
          }
          disabled={disabled}
        />
        <DatePicker
          {...(end || {})}
          customInput={<CustomInput disabled={disabled} data-error={(errors || []).length > 0 ? true : false} />}
          selected={localData.end}
          onChange={(d) => setLocalData({ end: d as (Date | null) || undefined })}
          className={
            "text-dark dark:text-light "
          }
          disabled={disabled}
        />
      </div>
      <InputError hide={hideErrorMessage} errors={errors} />
    </div>
  )
};

export default InputDateRange;
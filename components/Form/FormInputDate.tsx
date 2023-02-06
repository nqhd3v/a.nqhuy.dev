import DatePicker, { ReactDatePickerProps } from "react-datepicker"

interface iInputDate extends Omit<ReactDatePickerProps<any, any>, 'onChange'> {
  name: string;
  errors?: string[];
  onChange?: (date: Date | undefined) => void;
}
const InputDate: React.FC<iInputDate> = ({ name, onChange, className, ...props }) => {
  return (
    <DatePicker
      {...props}
      onChange={(d) => onChange?.(d as (Date | null) || undefined)}
      className={
        "text-dark dark:text-light " +
        className
      }
    />
  )
};

export default InputDate;
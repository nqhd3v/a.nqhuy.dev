import { useEffect, useState } from "react";

interface iInput {
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => Promise<void> | void | null;
  onSubmit: (value: string) => Promise<void> | void | null;
  onBlur?: () => Promise<void> | void | null;
  appendIcon?: JSX.Element;
}

const InputWithButton: React.FC<iInput> = ({
  value,
  placeholder,
  onChange,
  onSubmit,
  onBlur,
  disabled,
  appendIcon,
}) => {
  const [localValue, setLocalValue] = useState<string>('');

  // Update local if global change
  useEffect(() => {
    if (localValue !== value && value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChangeValue = (v: string) => {
    setLocalValue(v);
    onChange?.(v);
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={localValue}
        onChange={({ target }) => disabled ? null : handleChangeValue(target.value)}
        placeholder={placeholder || 'Input here'}
        className={
          'w-full pl-2 pr-9 py-1 rounded-sm outline-none ' +
          'h-9 border border-gray-400 dark:border-gray-600 ' +
          'bg-light dark:bg-dark ' +
          (!!appendIcon ? 'pr-18 ' : '')
        }
        onBlur={() => onBlur?.()}
        disabled={disabled}
      />
      {!!appendIcon ? (
        <div className="absolute h-7 w-7 right-9 top-1 rounded-sm flex justify-center items-center pointer-events-none">
          {appendIcon}
        </div>
      ) : null}

      <div
        className={
          "absolute h-7 w-7 right-1 top-1 rounded flex justify-center items-center cursor-pointer " +
          "border border-slate-400 dark:border-slate-600 bg-light dark:bg-dark duration-300 " +
          "hover:bg-blue-200 dark:hover:bg-blue-900 "
        }
        onClick={() => disabled ? null : onSubmit(localValue)}
      >
        <i className="fa-solid fa-arrow-right" />
      </div>
    </div>
  )
}

export default InputWithButton;

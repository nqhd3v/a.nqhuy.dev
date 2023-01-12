import { useEffect, useState } from "react";

interface iInput {
  className?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  prefix?: string;
  onChange?: (value: string) => Promise<void> | void;
  onBlur?: (currentValue: string) => Promise<void> | void;
  appendIcon?: JSX.Element;
}

const Input: React.FC<iInput> = ({
  value,
  placeholder,
  className,
  onChange,
  onBlur,
  disabled,
  prefix,
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

  const prefixStyle = (!!prefix ? { paddingLeft: `${8 * (prefix.length + 1)}px` } : {});

  return (
    <div className="relative">
      <input
        type="text"
        value={localValue}
        onChange={({ target }) => disabled ? null : handleChangeValue(target.value)}
        placeholder={placeholder || placeholder !== undefined ? placeholder : 'Input here'}
        className={
          'w-full px-2 py-1 rounded-sm outline-none ' +
          'h-9 border border-gray-400 dark:border-gray-600 ' +
          'bg-light dark:bg-dark ' +
          (!!appendIcon ? 'pr-9 ' : '') +
          (className || '')
        }
        onBlur={() => onBlur?.(localValue)}
        disabled={disabled}
        style={prefixStyle}
      />
      {!!prefix ? (
        <div className="text-base code absolute h-7 left-1 top-1 leading-7 pointer-events-none !text-blue-400 dark:!text-gray-600">
          {prefix}
        </div>
      ) : null}
      {!!appendIcon ? (
        <div className="absolute h-7 w-7 right-1 top-1 rounded-sm flex justify-center items-center pointer-events-none">
          {appendIcon}
        </div>
      ) : null}
    </div>
  )
}

export default Input;

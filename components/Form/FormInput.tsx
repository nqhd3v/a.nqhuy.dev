import { useEffect, useState } from "react";
import ErrorBoundary from "../wrapper/ErrorBoundary";
import InputError from "./FormInputError";
import { tFormRule } from "./types";

export interface iInput {
  name?: string;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  prefix?: string;
  onChange?: (value: string) => Promise<void> | void;
  onBlur?: (currentValue: string) => Promise<void> | void;
  appendIcon?: JSX.Element | "password";
  onAppendIconClick?: () => void;
  errors?: string[];
  rules?: tFormRule[];
  hideErrorMessage?: boolean;
}

const Input: React.FC<iInput> = ({
  name,
  value,
  placeholder,
  className,
  inputClassName,
  onChange,
  onBlur,
  disabled,
  prefix,
  appendIcon,
  onAppendIconClick,
  errors,
  hideErrorMessage,
}) => {
  const [localValue, setLocalValue] = useState<string>(value || '');
  const [showPass, setShowPass] = useState<boolean>(false);

  // Update local if global change
  useEffect(() => {
    if (localValue !== value) {
      setLocalValue(value || '');
    }
  }, [value]);

  const handleChangeValue = (v: string) => {
    setLocalValue(v);
    onChange?.(v);
  }

  const prefixStyle = (!!prefix ? { paddingLeft: `${8 * (prefix.length + 1)}px` } : {});
  const passIcon = showPass ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>;

  return (
    <ErrorBoundary>
      <div className={`relative ${(className || '')}`}>
        <div className="relative">
          <input
            name={name}
            type={appendIcon === "password" && !showPass ? "password" : "text"}
            value={localValue}
            onChange={({ target }) => disabled ? null : handleChangeValue(target.value)}
            placeholder={placeholder || placeholder !== undefined ? placeholder : 'Input here'}
            className={
              'w-full px-2 py-1 rounded-sm outline-none ' +
              'h-10 border border-gray-400 dark:border-gray-600 ' +
              'bg-light dark:bg-dark text-dark dark:text-light ' +
              (!!appendIcon ? 'pr-9 ' : '') +
              (inputClassName || '')
            }
            onBlur={() => onBlur?.(localValue)}
            disabled={disabled}
            style={prefixStyle}
            autoComplete="off"
            data-error={(errors || []).length > 0 ? true : false}
          />
          {!!prefix ? (
            <div className="text-base code absolute h-7 left-1 top-1 leading-7 pointer-events-none !text-blue-400 dark:!text-gray-600">
              {prefix}
            </div>
          ) : null}
          {!!appendIcon ? (
            <div
              className={
                "absolute h-7 w-7 right-1 top-1.5 rounded-sm flex justify-center items-center " +
                ((appendIcon === "password" || !!onAppendIconClick) ? "cursor-pointer  " : "pointer-events-none ") +
                (disabled ? "opacity-30 pointer-events-none " : "")
              }
              onClick={() => appendIcon === "password" ? setShowPass(!showPass) : onAppendIconClick?.()}
            >
              {appendIcon === "password" ? passIcon : appendIcon}
            </div>
          ) : null}
        </div>
        <InputError hide={hideErrorMessage} errors={errors} />
      </div>
    </ErrorBoundary>
  )
}

export default Input;

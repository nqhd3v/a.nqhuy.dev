import { useEffect, useState } from "react";
import { tFormRule } from "./Form/types";
import ErrorBoundary, { withBoundary } from "./wrapper/ErrorBoundary";

interface iInputWithButton {
  name?: string;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (value: string) => Promise<void> | void | null;
  onSubmit?: (value: string) => Promise<void> | void | null;
  onBlur?: () => Promise<void> | void | null;
  onAppendIconClick?: () => void;
  appendIcon?: JSX.Element | "password";
  errors?: string[];
  rules?: tFormRule[];
  hideErrorMessage?: boolean;
}

const InputWithButton: React.FC<iInputWithButton> = ({
  name,
  className,
  inputClassName,
  value,
  placeholder,
  onChange,
  onSubmit,
  onBlur,
  disabled,
  appendIcon,
  onAppendIconClick,
  errors,
  hideErrorMessage
}) => {
  const [localValue, setLocalValue] = useState<string>('');
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

  const passIcon = showPass ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>;

  const errorContent = () => {
    if (hideErrorMessage || !Array.isArray(errors) || errors.length === 0) {
      return null;
    }
    return (
      <ul className="input-error">
        {errors.map(err => <li key={err}>{err}</li>)}
      </ul>
    )
  }

  return (
    <ErrorBoundary>
      <div className={`relative ${className || ""}`}>
        <div className="relative">
          <input
            name={name}
            type={appendIcon === "password" && !showPass ? "password" : "text"}
            value={localValue}
            onChange={({ target }) => disabled ? null : handleChangeValue(target.value)}
            placeholder={placeholder || 'Input here'}
            className={
              'w-full pl-2 pr-9 py-1 rounded-sm outline-none ' +
              'h-10 border border-gray-400 dark:border-gray-600 ' +
              'bg-light dark:bg-dark disabled:opacity-30 ' +
              (!!appendIcon ? 'pr-18 ' : '') +
              (inputClassName || '')
            }
            onBlur={() => onBlur?.()}
            disabled={disabled}
            autoComplete="off"
            data-error={(errors || []).length > 0 ? true : false}
          />
          {!!appendIcon ? (
            <div
              className={
                "absolute h-7 w-7 right-10 top-1.5 rounded-sm flex justify-center items-center " +
                ((appendIcon === "password" || !!onAppendIconClick) ? "cursor-pointer  " : "pointer-events-none ") +
                (disabled ? "opacity-30 pointer-events-none " : "")
              }
              onClick={() => appendIcon === "password" ? setShowPass(!showPass) : onAppendIconClick?.()}
            >
              {appendIcon === "password" ? passIcon : appendIcon}
            </div>
          ) : null}

          <div
            className={
              "absolute h-7 w-7 right-1 top-1.5 rounded flex justify-center items-center " +
              "border border-slate-400 dark:border-slate-600 bg-light dark:bg-dark duration-300 " +
              "hover:bg-blue-200 dark:hover:bg-blue-900 " +
              (disabled ? "pointer-events-none opacity-30 " : "cursor-pointer ")
            }
            onClick={() => disabled ? null : onSubmit?.(localValue)}
          >
            <i className="fa-solid fa-arrow-right" />
          </div>
        </div>
        {errorContent()}
      </div>
    </ErrorBoundary>
  )
}

export default InputWithButton;

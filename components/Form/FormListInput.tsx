import { useEffect, useMemo, useState } from "react";
import { Input, InputWithButton } from ".";
import { tFormRule } from "./types";

interface iListInput {
  className?: string;
  value?: string[];
  name: string;
  onChange?: (value: string[]) => void;
  placeholder?: string;
  errors?: string[];
  disabled?: boolean;
  rules: tFormRule[];
}
const ListInput: React.FC<iListInput> = ({ className, name, placeholder, value, onChange, disabled, errors }) => {
  const [localValues, setLocalValues] = useState<string[]>([]);
  const [localNewValue, setLocalNewValue] = useState<string>('');
  const inputKeys = useMemo(() => localValues.map((_, i) => `${name}_${i}`), [localValues.join()]);
  const values = useMemo(() => {
    const res: Record<string, any> = {};
    inputKeys.forEach((k, i) => {
      res[k] = localValues[i] || '';
    });
    return res;
  }, [inputKeys.join()]);

  useEffect(() => {
    if ((value || []).join('|') !== localValues.join('|')) {
      setLocalValues(value || []);
    }
  }, [value]);

  const handleInputChange = (k: string) => (v: string) => {
    const valueNeedUpdate = inputKeys.map(key => key === k ? v : values[key]);
    setLocalValues(valueNeedUpdate);
    onChange?.(valueNeedUpdate);
  };

  const handleAddInput = () => {
    const newValues = [...localValues, localNewValue];
    setLocalNewValue('');
    setLocalValues(newValues);
    onChange?.(newValues);
  }
  const handleRemoveInput = (k: string) => {
    const valueNeedUpdate = inputKeys.map(key => key === k ? undefined : values[key]).filter(v => v !== undefined);
    setLocalValues(valueNeedUpdate);
    onChange?.(valueNeedUpdate);
  }

  return (
    <div className={`w-full space-y-1 ${className || ''}`}>
      {inputKeys.map((k, i) => (
        <Input
          key={k}
          value={values[k]}
          onChange={handleInputChange(k)}
          placeholder={`${placeholder}[${i}] =`}
          appendIcon={<i className="fas fa-times text-dark dark:text-light" />}
          onAppendIconClick={() => handleRemoveInput(k)}
          disabled={disabled}
        />
      ))}
      <InputWithButton
        inputClassName="opacity-50 focus:opacity-100 duration-300"
        placeholder="new_option ="
        buttonIcon="fas fa-plus"
        onChange={v => setLocalNewValue(v)}
        value={localNewValue}
        onSubmit={handleAddInput}
        disabled={disabled}
        errors={errors}
      />
    </div>
  )
}

export default ListInput;
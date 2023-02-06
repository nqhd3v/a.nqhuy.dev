import React, { useMemo, useState } from "react";
import { withBoundary } from "../wrapper/ErrorBoundary";
import { isFormValidated } from "./func";
import { tFormErrors, tFormRule, tFormValues } from "./types";
import useForm, { iUseForm } from "./useForm";
import Input from "./FormInput";
import ListInput from "./FormListInput";
import InputDate from "./FormInputDate";
import InputDateRange from "./FormInputDateRange";
import InputWithButton from "./FormInputWithButton";

export interface iForm {
  children: JSX.Element[] | JSX.Element;
  initialValues?: tFormValues;
  onFinish?: (values: tFormValues) => Promise<void> | void;
  disabled?: boolean;
  className?: string;
  form?: iUseForm;
}

const Form: React.FC<iForm> = ({
  initialValues,
  children,
  onFinish,
  disabled,
  className,
  form,
}) => {
  const [formData, setFormData] = useState<tFormValues>(initialValues || {});
  const [formErr, setFormErr] = useState<tFormErrors>({});

  const childrenArr = useMemo(() => Array.isArray(children) ? children : [children], [children]);
  const inpRules = useMemo(() => {
    const rules: Record<string, tFormRule[]> = {};
    childrenArr.forEach(child => {
      if (child.props.name) {
        rules[child.props.name] = child.props.rules;
      }
    })
    return rules;
  }, [childrenArr]);

  const handleValidate = (fieldValues?: tFormValues) => {
    return isFormValidated(fieldValues || formData, inpRules);
  }
  const handleSetField = (itemName: string, itemValue: any) => {
    const newFormData = {
      ...formData,
      [itemName]: itemValue,
    };
    setFormData(newFormData);
    // Revalidate form if form already error before.
    const { errors } = isFormValidated({ [itemName]: itemValue }, inpRules, true);
    const newFormErrors = {
      ...formErr,
      [itemName]: errors[itemName],
    };
    setFormErr(newFormErrors);
    return {
      values: newFormData,
      errors: newFormErrors,
    }
  }
  const handleSetFields = (fieldValues: tFormValues) => {
    const newFormData = {
      ...formData,
      ...fieldValues,
    }
    setFormData(newFormData);
    // Revalidate form if form already error before.
    const { errors } = isFormValidated(fieldValues, inpRules, true);
    const newFormErrors = {
      ...formErr,
      ...errors,
    }
    setFormErr(newFormErrors);
    return {
      values: newFormData,
      errors: newFormErrors,
    }
  }
  const handleSetError = (field: string, errors: string[] = []): tFormErrors => {
    const newFormErrors = {
      ...formErr,
      [field]: (errors.length === 0)
        ? []
        : [...Array.from(new Set([
          ...(formErr[field] || []),
          ...errors,
        ]))],
    };
    setFormErr(newFormErrors);
    return newFormErrors;
  }
  const handleSetErrors = (fieldErrors: tFormErrors): tFormErrors => {
    const fieldErrorUpdated: tFormErrors = {};
    Object.keys(fieldErrors).forEach(f => {
      fieldErrorUpdated[f] = {
        ...(formErr[f] || {}),
        ...fieldErrors[f]
      };
    })
    const newFormErrors = {
      ...formErr,
      ...fieldErrorUpdated,
    };
    setFormErr(newFormErrors);
    return newFormErrors;
  }
  const handleFormReset = () => {
    setFormData(initialValues || {});
    setFormErr({});
  }
  const handleFormSubmit = async () => {
    // Validate data
    const { isHasError, errors } = isFormValidated(formData, inpRules);
    if (isHasError) {
      setFormErr(errors);
      return;
    }
    setFormErr({});

    // Submit data
    await onFinish?.(formData);
  }

  // Pass form's func to useForm's func
  if (form) {
    form.setField = handleSetField;
    form.setFields = handleSetFields;
    form.setFieldError = handleSetError;
    form.setFieldErrors = handleSetErrors;
    form.validate = handleValidate;
    form.submit = handleFormSubmit;
    form.reset = handleFormReset;
  }

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleFormSubmit();
      }}
      onReset={() => handleFormReset()}
      autoComplete="off"
      className={className}
    >
      {childrenArr.map(childEle => {
        if (!React.isValidElement(childEle)) {
          console.error('Form - Invalid child element:', childEle);
          return null;
        }
        const { name: childTypeName } = childEle.type as any;
        const { name, type: childPropsType, disabled: childPropsDisabled } = childEle.props as any;
        if (childTypeName === "Input") {
          if (!name) {
            console.error('Form - Input - Input element required name prop:', childEle);
            return childEle;
          }
          return React.cloneElement<any>(childEle, {
            errors: formErr[name] || [],
            onChange: (v: any) => handleSetField(name, v),
            value: formData[name],
            key: `${childTypeName}:${name}`,
            disabled: disabled || childPropsDisabled,
          });
        }
        if (childTypeName === "InputWithButton") {
          if (!name) {
            console.error('Form - InputWithButton - Input element required name prop:', childEle);
            return childEle;
          }
          return React.cloneElement<any>(childEle, {
            errors: formErr[name] || [],
            onChange: (v: any) => handleSetField(name, v),
            onSubmit: () => handleFormSubmit(),
            value: formData[name],
            key: `${childTypeName}:${name}`,
            disabled: disabled || childPropsDisabled,
          });
        }
        if (childTypeName === "InputDate") {
          if (!name) {
            console.error('Form - InputDate - Input element required name prop:', childEle);
            return childEle;
          }
          return React.cloneElement<any>(childEle, {
            errors: formErr[name] || [],
            onChange: (v: any) => handleSetField(name, v),
            selected: formData[name],
            key: `${childTypeName}:${name}`,
            disabled: disabled || childPropsDisabled,
          });
        }
        if (childTypeName === "InputDateRange") {
          if (!name) {
            console.error('Form - InputDateRange - Input element required name prop:', childEle);
            return childEle;
          }
          return React.cloneElement<any>(childEle, {
            errors: formErr[name] || [],
            onChange: (v: any) => handleSetField(name, v),
            value: formData[name],
            key: `${childTypeName}:${name}`,
            disabled: disabled || childPropsDisabled,
          });
        }
        if (childTypeName === "ListInput") {
          if (!name) {
            console.error('Form - ListInput - Input element required name prop:', childEle);
            return childEle;
          }
          return React.cloneElement<any>(childEle, {
            errors: formErr[name] || [],
            onChange: (v: any) => handleSetField(name, v),
            value: formData[name],
            key: `${childTypeName}:${name}`,
            disabled: disabled || childPropsDisabled,
          });
        }
        if (childTypeName === "Button" && childPropsType === "submit") {
          return React.cloneElement<any>(childEle, {
            key: `${childTypeName}:submit`,
            disabled: disabled || childPropsDisabled,
          });
        }
        return childEle;
      })}
    </form>
  )
};

export default withBoundary<iForm>(Form);
export {
  useForm,
  Input,
  InputDate,
  InputDateRange,
  InputWithButton,
  ListInput,
}
import { useState } from "react"

type tFormField = string;
type tFormValue = any;
export interface iForm {
  values: Record<tFormField, tFormValue>;
  errors: Record<tFormField, string[]>
};
export interface iUseForm {
  setField: (field: tFormField, value: tFormValue) => void;
  setFields: (fields: iForm['values']) => void;
  setFieldError: (field: tFormField, errors: string[]) => void;
  setFieldErrors: (fields: iForm['errors']) => void;
  validate: () => void;
  submit: () => Promise<void> | void;
  reset: () => void;
}

const useForm = (): iUseForm => {
  const handleSetField = (field: tFormField, value: tFormValue) => undefined;
  const handleSetFields = (fieldWithValues: iForm['values']) => undefined;
  const handleSetError = (field: tFormField, errors: string[]) => undefined;
  const handleSetErrors = (fieldWithErrors: iForm['errors']) => undefined;
  const handleValidate = () => undefined;
  const handleSubmit = () => undefined;
  const handleReset = () => undefined;
  
  return {
    setField: handleSetField,
    setFields: handleSetFields,
    setFieldError: handleSetError,
    setFieldErrors: handleSetErrors,
    validate: handleValidate,
    submit: handleSubmit,
    reset: handleReset,
  }
};

export default useForm;
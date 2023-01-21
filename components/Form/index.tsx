import React, { useMemo, useRef, useState } from "react";
import { isFormValidated } from "./func";
import { tFormRule } from "./types";

export interface iForm {
  children: JSX.Element[] | JSX.Element;
  initialValues?: Record<string, any>;
  onFinish?: (values: Record<string, any>) => Promise<void> | void;
  disabled?: boolean;
}

const Form: React.FC<iForm> = ({
  initialValues,
  children,
  onFinish,
  disabled,
}) => {
  const formRef = useRef();
  const [formData, setFormData] = useState<Record<string, any>>(initialValues || {});
  const [formErr, setFormErr] = useState<Record<string, string[]>>({});

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

  const handleChangeItem = (itemName: string) => (itemValue: any) => {
    setFormData({
      ...formData,
      [itemName]: itemValue,
    });
    // Revalidate form if form already error before.
    const { errors } = isFormValidated({ [itemName]: itemValue }, inpRules);
    setFormErr({
      ...formErr,
      [itemName]: errors[itemName],
    });
  }

  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    // Validate data
    const { isHasError, errors } = isFormValidated(formData, inpRules);
    if (isHasError) {
      setFormErr(errors);
      return;
    }
    setFormErr({});

    // Submit data
    onFinish?.(formData);
  }

  return (
    <form
      ref={formRef.current}
      onSubmit={e => handleFormSubmit(e)}
      autoComplete="off"
    >
      {childrenArr.map(childEle => {
        if (!React.isValidElement(childEle)) {
          console.error('Form - Invalid child element:', childEle);
          return null;
        }
        const { name: childTypeName } = childEle.type as any;
        const { name, type: childPropsType } = childEle.props as any;
        if (childTypeName === "Input") {
          if (!name) {
            console.error('Form - Input - Input element required name prop:', childEle);
            return childEle;
          }
          return React.cloneElement<any>(childEle, {
            errors: formErr[name] || [],
            onChange: (v: any) => handleChangeItem(name)(v),
            value: formData[name],
            key: `${childTypeName}:${name}`,
            disabled,
          });
        }
        if (childTypeName === "Button" && childPropsType === "submit") {
          return React.cloneElement<any>(childEle, {
            key: `${childTypeName}:submit`,
            disabled,
          });
        }
        return childEle;
      })}
    </form>
  )
};

export default Form;
import { tFormRule } from "./types";

type tValidated = {
  errors: Record<string, string[]>,
  isHasError: boolean;
};
export const isFormValidated = (
  values: Record<string, any>,
  rules: Record<string, tFormRule[]>,
  validateByValues?: boolean
): tValidated => {
  const errors: Record<string, string[]> = {};
  let isHasError = false;
  Object.keys(rules).forEach(field => {
    if ((rules[field] || []).length === 0) {
      return;
    }
    const valueItem = values[field];
    if (!valueItem && validateByValues) {
      return;
    }
    rules[field].forEach(rule => {
      if (!Array.isArray(errors[field])) {
        errors[field] = [];
      }
      if (
        rule.required &&
        (
          valueItem === undefined ||
          (
            typeof valueItem === "string" &&
            (
              valueItem === "" ||
              valueItem.trim() === ""
            )
          ) ||
          (
            typeof valueItem === "object" &&
            Object.keys(valueItem).filter(k => valueItem[k]).length < Object.keys(valueItem).length
          )
        )
      ) {
        errors[field].push(`Field '${field}' is required!`);
      }
      if (rule.regex && typeof valueItem === "string" && !rule.regex.test(valueItem)) {
        errors[field].push(`Field '${field}' is wrong format!`);
      }
      if (!isHasError && errors[field].length > 0) {
        isHasError = true;
      }
    });
  });
  return {
    errors,
    isHasError,
  };
}
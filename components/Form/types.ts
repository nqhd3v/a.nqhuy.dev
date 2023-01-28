export type tFormRule = {
  required?: boolean;
  regex?: RegExp;
  message?: string;
}
export type tFormValues = Record<string, any>;
export type tFormErrors = Record<string, string[]>;
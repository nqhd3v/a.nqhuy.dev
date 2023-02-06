import { FormattedMessage } from "react-intl";

interface iInputError {
  hide?: boolean;
  errors?: string[];
}
const InputError: React.FC<iInputError> = ({ hide, errors }) => {
  if (hide || !Array.isArray(errors) || errors.length === 0) {
    return null;
  }
  return (
    <ul className={`input-error ${errors.length > 1 ? "errors" : ""}`}>
      {errors.map(err => <li key={err}><FormattedMessage id={err} /></li>)}
    </ul>
  )
};

export default InputError;
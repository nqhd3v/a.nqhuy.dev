import { ButtonHTMLAttributes } from "react";

interface iButton {
  children: (JSX.Element | string)[] | JSX.Element | string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => Promise<void> | void;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  className?: string;
}

const Button: React.FC<iButton> = ({
  children,
  loading,
  onClick,
  disabled,
  type,
  className,
}) => {
  const isDisabledButton = disabled || loading;

  return (
    <button
      type={type}
      className={
        "run " +
        (className || "")
      }
      disabled={isDisabledButton}
      onClick={() => isDisabledButton ? null : onClick?.()}
    >
      {children}
      {loading ? '...' : null }
    </button>
  )
};

export default Button;
import React, { useState } from "react";
import { loginWithFacebook, loginWithGithub, loginWithGoogle } from "../../../utils/Firebase/auth";

interface iFirebaseWithSocial {
  withDesc?: boolean;
  withGoogle?: boolean;
  withGithub?: boolean;
  withFacebook?: boolean;
  disabled?: boolean;
  onHandling?: (status: boolean) => void;
  onError?: (err: string) => void;
}

interface iAction {
  className?: string;
  iconClassName: string;
  onClick?: () => void;
  disabled?: boolean;
}
const Action: React.FC<iAction> = ({ className, iconClassName, disabled, onClick }) => {
  return (
    <div
      className={
        "rounded-md w-10 h-10 text-xl flex justify-center items-center dark:bg-transparent dark:border dark:border-gray-600 dark:hover:bg-slate-50/10 " +
        (disabled ? "opacity-30 pointer-events-none " : "cursor-pointer ") +
        (className || "")
      }
      onClick={(e) => {e.preventDefault(); onClick?.()}}
    >
      <i className={`text-light ${iconClassName}`} />
    </div>
  )
}

const FirebaseWithSocial: React.FC<iFirebaseWithSocial> = ({
  withDesc,
  withFacebook,
  withGithub,
  withGoogle,
  disabled,
  onHandling,
  onError,
}) => {
  const handleLogin = async (action: () => Promise<void> | void) => {
    onHandling?.(true);
    try {
      await action();
    } catch (err: any) {
      onError?.(err.message);
    }
    onHandling?.(false);
  }

  return (
    <>
      {withDesc ? (
        <div className="code comment my-10">-- or using your social account --</div>
      ) : null}
      <div className="flex justify-center items-center space-x-5 mb-10">
        {withFacebook ? (
          <Action
            onClick={() => handleLogin(loginWithFacebook)}
            className="bg-blue-400 hover:bg-blue-500"
            iconClassName="fa-brands fa-facebook-f dark:text-blue-400"
            disabled={disabled}
          />
        ) : null}
        {withGoogle ? (
          <Action
            onClick={() => handleLogin(loginWithGoogle)}
            className="bg-red-400 hover:bg-red-500"
            iconClassName="fa-brands fa-google dark:text-red-400"
            disabled={disabled}
          />
        ) : null}
        {withGithub ? (
          <Action
            onClick={() => handleLogin(loginWithGithub)}
            className="bg-gray-400 hover:bg-gray-500"
            iconClassName="fa-brands fa-github dark:text-gray-200"
            disabled={disabled}
          />
        ) : null}
      </div>
    </>
  );
}

export default FirebaseWithSocial
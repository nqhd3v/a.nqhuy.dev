import Link from "next/link";
import React from "react";

interface IError {
  status: number;
  message?: string;
}

const Error: React.FC<IError> = ({ status, message }) => {
  return (
    <div className="h-screen flex items-center justify-center text-blue-900 dark:text-blue-200">
      <div className="flex flex-col sm:flex-row items-center sm:space-x-5">
        <div className="w-18 h-10 flex justify-center items-center font-bold text-xl sm:border-r">{status}</div>
        <div className="max-w-[300px]">
          <div className="uppercase">
            {message}
          </div>
          <Link href="/">
            <div className="text-gray-400 dark:text-gray-500 text-sm text-center sm:text-left cursor-pointer">
              return home
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
};

export default Error;
import Image from "next/image";
import { logout } from "../utils/Firebase/auth";
import useMessage from "../utils/international";
import { useFirebaseAuth } from "./Firebase/FirebaseAuthWrapper"

const Account = () => {
  const { user, isAuthenticating } = useFirebaseAuth();
  const { message } = useMessage();

  if (isAuthenticating || !user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-14 h-4 rounded bg-gray-500/30 dark:bg-gray-600/30 animate-pulse" />
        <div className="w-8 h-8 rounded-full bg-gray-500/30 dark:bg-gray-600/30 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="code font-bold link" onClick={logout}>
        <span className="var">a</span>
        {'.'}
        <span className="func">exit</span>
        {'()'}
      </div>
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-400 dark:bg-gray-600 overflow-hidden relative">
        <Image width={32} height={32} src={user.data.photoURL || '/'} alt="" />
      </div>
    </div>
  )
}

export default Account;
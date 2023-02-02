import { User } from "firebase/auth";
import React from "react";
import { logout, onAuthStateChanged } from "../../utils/Firebase/auth";
import { createUserIfNotExist } from "../../utils/Firebase/services/user";
import { tDataTransformed, tUser } from "../../utils/types/model";
import { tComponentWrapper } from "../../utils/types/sample";
import Account from "../Account";
import DarkModeToggle from "../DarkModeToggle";
import Authenticated from "../wrapper/Authenticated";
import { withBoundary } from "../wrapper/ErrorBoundary";

interface iFirebaseAuth {
  user?: tDataTransformed<tUser>;
  isAuthenticating: boolean;
  setUser: (user?: tDataTransformed<tUser>) => Promise<void> | void;
  isAuthenticated: boolean;
}
const FirebaseAuthContext = React.createContext<iFirebaseAuth>({
  user: undefined,
  isAuthenticating: true,
  setUser: () => undefined,
  isAuthenticated: false,
});

export const useFirebaseAuth = () => {
  return React.useContext(FirebaseAuthContext);
}

const FirebaseAuthWrapper: React.FC<tComponentWrapper> = ({ children }) => {
  const [isAuthenticating, setAuthenticating] = React.useState<boolean>(true);
  const [currentFirebaseAuthUser, setFirebaseAuthUser] = React.useState<User | undefined>(undefined);
  const [currentUser, setCurrentUser] = React.useState<tDataTransformed<tUser> | undefined>(undefined);

  const handleUpdateCurrentUser = async () => {
    if (!currentFirebaseAuthUser) {
      return;
    }
    const userData = await createUserIfNotExist(currentFirebaseAuthUser);
    if (!userData) {
      console.error('Unexpected error when create new user for first times login! Contact to admin for more information!');
    }
    setCurrentUser(userData);
  }

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (user) => {
      setFirebaseAuthUser(user || undefined);
      if (!user) {
        setCurrentUser(undefined);
      }
      setAuthenticating(false);
    });

    return () => {
      unsubscribe();
    }
  });

  React.useEffect(() => {
    handleUpdateCurrentUser();
  }, [!currentFirebaseAuthUser])

  return (
    <FirebaseAuthContext.Provider
      value={{
        user: currentUser,
        isAuthenticating,
        setUser: user => setCurrentUser(user),
        isAuthenticated: !!currentFirebaseAuthUser,
      }}
    >
      {children}
      <div className="fixed top-0 right-0 w-full h-[60px] bg-blue-100/30 dark:bg-dark/30 backdrop-blur-sm flex justify-end items-center space-x-5 px-5">
        <DarkModeToggle />
        <Account />
      </div>
    </FirebaseAuthContext.Provider>
  )
};

export const withFirebaseAuth = <T extends object>(Component: React.FunctionComponent<T>, requireAuthenticated?: boolean, renderLoadingIfNoAuth?: boolean) => {
  class WithFirebaseAuth extends React.Component<T> {
    render() {
      if (requireAuthenticated) {
        return (
          <FirebaseAuthWrapper>
            <Authenticated renderLoadingIfNoAuth={renderLoadingIfNoAuth}>
              <Component {...this.props as T} />
            </Authenticated>
          </FirebaseAuthWrapper>
        )
      }
      return (
        <FirebaseAuthWrapper>
          <Component {...this.props as T} />
        </FirebaseAuthWrapper>
      )
    }
  };

  return WithFirebaseAuth;
}

export default withBoundary<tComponentWrapper>(FirebaseAuthWrapper);

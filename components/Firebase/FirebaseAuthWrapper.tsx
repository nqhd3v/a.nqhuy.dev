import { User } from "firebase/auth";
import React from "react";
import { onAuthStateChanged } from "../../utils/Firebase/auth";
import { tComponentWrapper } from "../../utils/types/sample";

interface iFirebaseAuth {
  user?: User;
  loading: boolean;
  setUser: (user?: User) => Promise<void> | void;
}
const FirebaseAuthContext = React.createContext<iFirebaseAuth>({
  user: undefined,
  loading: true,
  setUser: () => undefined,
});

export const useFirebaseAuth = () => {
  return React.useContext(FirebaseAuthContext);
}

const FirebaseAuthWrapper: React.FC<tComponentWrapper> = ({ children }) => {
  const [loadingUser, setLoadingUser] = React.useState<boolean>(true);
  const [currentUser, setCurrentUser] = React.useState<User | undefined>(undefined);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(user => {
      setCurrentUser(user || undefined);
      setLoadingUser(false);
    });

    return () => {
      unsubscribe();
    }
  })

  return (
    <FirebaseAuthContext.Provider
      value={{
        user: currentUser,
        loading: loadingUser,
        setUser: user => setCurrentUser(user),
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  )
};

export const withFirebaseAuth = <T extends object>(Component: React.FunctionComponent<T>) => {
  class WithFirebaseAuth extends React.Component<T> {
    render() {
      return (
        <FirebaseAuthWrapper>
          <Component {...this.props as T} />
        </FirebaseAuthWrapper>
      )
    }
  };

  return WithFirebaseAuth;
}

export default FirebaseAuthWrapper;

import { useRouter } from "next/router";
import { useEffect } from "react";
import { tComponentWrapper } from "../../utils/types/sample"
import Error from "../error/Error";
import { useFirebaseAuth } from "../Firebase/FirebaseAuthWrapper";
import { withBoundary } from "./ErrorBoundary";

interface iAuthenticated extends tComponentWrapper { renderLoadingIfNoAuth?: boolean };
const Authenticated: React.FC<iAuthenticated> = ({ children, renderLoadingIfNoAuth }) => {
  const { isAuthenticated, isAuthenticating: loading } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push(`/auth?dst=${router.asPath}`);
    }
  }, [!isAuthenticated, loading]);

  if (loading && renderLoadingIfNoAuth) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center text-dark dark:text-light">
        <i className="fa-solid fa-spinner fa-spin mr-2" />
        Checking your authenticated information...
      </div>
    )
  }

  if (!isAuthenticated && renderLoadingIfNoAuth) {
    return (
      <Error
        status={401}
        message="You need to login to continue!"
        actionDest={`/auth?dst=${router.asPath}`}
        actionMessage="return login"
      />
    )
  }

  return (
    <>
      {children}
    </>
  );
}

export default withBoundary<iAuthenticated>(Authenticated);
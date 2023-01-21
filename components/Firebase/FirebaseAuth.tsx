import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFirebaseAuth, withFirebaseAuth } from "./FirebaseAuthWrapper";
import FirebaseWithAccount from "./service/FirebaseWithAccount";
import FirebaseWithSocial from "./service/FirebaseWithSocial";

interface iFirebaseAuth {
  withGoogle?: boolean;
  withGithub?: boolean;
  withFacebook?: boolean;
  withAccount?: boolean;
  redirectIfSuccess: string;
}

const FirebaseAuth: React.FC<iFirebaseAuth> = ({
  withGoogle,
  withGithub,
  withFacebook,
  withAccount,
  redirectIfSuccess,
}) => {
  const router = useRouter();
  const [handling, setHandling] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const { user, loading: userLoading } = useFirebaseAuth();

  useEffect(() => {
    if (user && !userLoading) {
      router.push(redirectIfSuccess);
    }
  }, [user, userLoading])

  return (
    <div className="relative w-full max-w-[400px] p-5 rounded-md bg-light dark:bg-dark border border-gray-400 dark:border-gray-600">
      <div className="code text-3xl font-bold mb-5">
        <span className="var">a</span>
        {' = '}
        <span className="operator">new</span>
        &nbsp;
        <span className="class">Auth</span>
        {'();'}
      </div>
      {withAccount ? (
        <FirebaseWithAccount
          disabled={handling || userLoading}
          onError={e => setError(e)}
        />
      ) : null}
      {(withGoogle || withFacebook || withGithub) ? (
        <FirebaseWithSocial
          withDesc
          withGoogle={withGoogle}
          withFacebook={withFacebook}
          withGithub={withGithub}
          onHandling={s => setHandling(s)}
          disabled={handling || userLoading}
          onError={e => setError(e)}
        />
      ) : null}

      {error ? (
        <>
          <div className="code comment">Error:</div>
          <div className="code comment"> - {error}</div>
        </>
      ) : null}
      {(handling || userLoading) ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <i className="fa-solid fa-spin fa-spinner text-2xl" />
        </div>
      ) : null}
    </div>
  )
};

export default withFirebaseAuth<iFirebaseAuth>(FirebaseAuth);

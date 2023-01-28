import { useRouter } from "next/router";
import { useEffect } from "react";
import { useFirebaseAuth, withFirebaseAuth } from "../../components/Firebase/FirebaseAuthWrapper";
import LayoutAnimated from "../../components/wrapper/LayoutAnimated";

const AuthValue = ({ name, value }: { name: string, value: string | undefined | null }) => {
  return (
    <div className="code">
      <span className="var">{name}</span>
      {" = "}
      {value ? <span className="str">{value}</span> : <span className="def">undefined</span> }
    </div>
  )
}

const AuthInfo = () => {
  const router = useRouter();
  const { user, isAuthenticating: loading } = useFirebaseAuth();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/auth?dst=/auth/info");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <LayoutAnimated title="Auth Info" description="This page will display your authenticated information">
        <div className="w-full max-w-[500px] m-auto min-h-screen py-10">
          <div className="p-5 border border-gray-400 dark:border-gray-600 rounded-md">
            Checking your account...
          </div>
        </div>
      </LayoutAnimated>
    )
  }

  if (!user) {
    return (
      <LayoutAnimated title="Auth Info" description="This page will display your authenticated information">
        <div className="w-full max-w-[500px] m-auto min-h-screen py-10">
          <div className="p-5 border border-gray-400 dark:border-gray-600 rounded-md">
            You need to login to view your authenticated information!
          </div>
        </div>
      </LayoutAnimated>
    )
  }

  return (
    <LayoutAnimated title="Auth Info" description="This page will display your authenticated information">
      <div className="w-full max-w-[500px] m-auto min-h-screen py-10">
        <div className="p-5 border border-gray-400 dark:border-gray-600 rounded-md">
          <div className="code comment">
            {'user info '}
          </div>
          <AuthValue name="displayName" value={user.data.displayName} />
          <AuthValue name="email" value={user.data.email} />
        </div>
      </div>
    </LayoutAnimated>
  )
};

export default withFirebaseAuth(AuthInfo);
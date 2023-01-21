import moment from "moment";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useFirebaseAuth, withFirebaseAuth } from "../../components/Firebase/FirebaseAuthWrapper";
import LayoutAnimated from "../../components/wrapper/LayoutAnimated";

const AuthInfo = () => {
  const router = useRouter();
  const { user, loading } = useFirebaseAuth();

  useEffect(() => {
    if (!user && !loading) {
      router.push("/auth?dst=/auth/info");
    }
  }, [user, loading]);

  if (!user || loading) {
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

  console.log(user);
  return (
    <LayoutAnimated title="Auth Info" description="This page will display your authenticated information">
      <div className="w-full max-w-[500px] m-auto min-h-screen py-10">
        <div className="p-5 border border-gray-400 dark:border-gray-600 rounded-md">
          <div className="code comment">
            {'user info '}
            {user.metadata.lastSignInTime ? ` - logged in at "${moment(user.metadata.lastSignInTime).format('DD/MM/YYYY HH:mm:ss')}"` : ''}
          </div>
          <div className="code">
            <span className="var">displayName</span>
            {" = "}
            {user.displayName ? <span className="str">{user.displayName}</span> : <span className="def">undefined</span> }
          </div>
          <div className="code">
            <span className="var">email</span>
            {" = "}
            {user.email ? <span className="str">{user.email}</span> : <span className="def">undefined</span> }
          </div>
          <div className="code comment">auth info</div>
          <div className="code">
            <span className="var">provider</span>
            {" = "}
            {user.providerData.length > 0 ? <span className="str">{user.providerData[0].providerId}</span> : <span className="def">undefined</span> }
            {";"}
          </div>
        </div>
      </div>
    </LayoutAnimated>
  )
};

export default withFirebaseAuth<any>(AuthInfo);
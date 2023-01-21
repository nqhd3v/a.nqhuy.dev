import { useRouter } from "next/router";
import { useMemo } from "react";
import FirebaseAuth from "../../components/Firebase/FirebaseAuth"
import LayoutAnimated from "../../components/wrapper/LayoutAnimated";

const AuthPage = () => {
  const router = useRouter();
  const dst = useMemo(() => router.isReady && router.query.dst as string || "/auth/info", [router.isReady, router.query.dst]);

  return (
    <LayoutAnimated
      title="Auth"
      description="This page is used to authenticate your account!"
    >
      <div className="w-full h-screen flex justify-center items-center">
        <FirebaseAuth
          withGoogle
          withAccount
          redirectIfSuccess={dst}
        />
      </div>
    </LayoutAnimated>
  )
};

export default AuthPage;
import { DocumentReference } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Button from "../../../components/Button";
import { useFirebaseAuth, withFirebaseAuth } from "../../../components/Firebase/FirebaseAuthWrapper";
import SubPageHeader from "../../../components/SubPageHeader";
import LayoutAnimated from "../../../components/wrapper/LayoutAnimated";
import { getActivityByCode, joinActivityByCode } from "../../../utils/Firebase/services/activityTrackings";
import useMessage from "../../../utils/international";
import { DocumentId, tActivityTracking, tDataTransformed, tUser } from "../../../utils/types/model";

const JoinActivityByCode = () => {
  const router = useRouter();
  const { message } = useMessage();
  const { user, isAuthenticating } = useFirebaseAuth();
  const activityCode = useMemo(() => router.isReady ? router.query.code as string : undefined, [router.isReady, router.query.code]);

  const [activityData, setActivityData] = useState<tDataTransformed<tActivityTracking> | undefined>(undefined);
  const [fetching, setFetching] = useState<boolean>(true);
  const [joining, setJoining] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  
  const handleGetActivityByCode = async (code: string) => {
    setFetching(true);
    const res = await getActivityByCode(code, user as tDataTransformed<tUser>, false);
    if (!res || res.isError || !res.data) {
      setError(res?.errorMessageId || 'exception.activityTracking.join.unknown');
      setFetching(false);
      return;
    }
    setActivityData({
      data: res.data,
      _id: res._id as DocumentId,
      _ref: res._ref as DocumentReference,
    });
    setFetching(false);
  }

  const handleJoin = async () => {
    if (!activityCode) {
      setError('exception.activityTracking.invalid-input');
      return;
    }
    setJoining(true);
    const res = await joinActivityByCode(activityCode, user as tDataTransformed<tUser>, true);
    if (res.isError || !res.data) {
      setError(res.errorMessageId || 'exception.activityTracking.join.unknown');
      setJoining(false);
      return;
    }
    setJoining(false);
    setTimeout(() => router.push(`/a/${res.data?.code}`), 2500);
  }

  useEffect(() => {
    if (activityCode && user) {
      // Fetch activities at first times
      handleGetActivityByCode(activityCode);
    }
  }, [activityCode, user]);

  return (
    <LayoutAnimated title="Join activity" description="This page allow any authenticated user join the activity with invite">
      <div className="w-full max-w-[650px] m-auto pt-10">
        <SubPageHeader
          title="ActivityTracking"
          subTitle="joinByInvite"
          subTitleParams={[
            <span className="str" key={`activityTrackingDetail.subHeader.subTitle.params.code.${activityCode}`}>{activityCode}</span>
          ]}
          subTitleValue={(isAuthenticating || fetching) ? undefined : activityData?.data.name}
          description={message('activityTracking.join.desc')}
        />

        <div className="flex items-center space-x-5 relative">
          <Button
            disabled={joining || isAuthenticating || fetching || !activityData}
            onClick={handleJoin}
          >
            <FormattedMessage id="activityTracking.join.run" />
          </Button>

          {(isAuthenticating || fetching) ? (
            <div className="w-40 h-4 rounded bg-gray-400/30 dark:bg-gray-600/30 animate-pulse" />
          ) : (
            <div className="text-dark dark:text-light font-bold">
              {activityData?.data ? `${activityData?.data.participants.length} persons joined` : '-- persons joined'}
            </div>
          )}
        </div>
        {error ? (
          <div className="code comment mt-5">
            {'Error: '}
            <FormattedMessage id={error} />
          </div>
        ) : null}
      </div>
    </LayoutAnimated>
  )
};

export default withFirebaseAuth(JoinActivityByCode, true);
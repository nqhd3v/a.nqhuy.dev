import { DocumentReference } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useReducer, useState } from "react";
import EditActivity from "../../components/ActivityTracking/Edit";
import ActivityParticipants from "../../components/ActivityTracking/Participants";
import { useFirebaseAuth, withFirebaseAuth } from "../../components/Firebase/FirebaseAuthWrapper";
import Modal from "../../components/Modal";
import SubPageHeader from "../../components/SubPageHeader";
import LayoutAnimated from "../../components/wrapper/LayoutAnimated";
import { getActivityByCode } from "../../utils/Firebase/services/activityTrackings";
import { getUsersByRefs } from "../../utils/Firebase/services/user";
import { DocumentId, tActivityTracking, tDataTransformed, tUser } from "../../utils/types/model";

const ActivityTrackingDetail = () => {
  const router = useRouter();
  const { user, isAuthenticating } = useFirebaseAuth();
  const activityCode = useMemo(() => router.isReady ? router.query.code as string : undefined, [router.isReady, router.query.code]);

  const [activityData, setActivityData] = useState<tDataTransformed<tActivityTracking> | undefined>(undefined);
  const [activityParticipants, setActivityParticipants] = useState<Record<string, tDataTransformed<tUser>>>({});
  const [fetching, setFetching] = useState<boolean>(true);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);

  const handleGetActivityParticipants = async (users: DocumentReference[]) => {
    const res = await getUsersByRefs(users);
    setActivityParticipants(res);
  }
  const handleGetActivityByCode = async (code: string) => {
    setFetching(true);
    const res = await getActivityByCode(code, user as tDataTransformed<tUser>);
    if (!res || res.isError || !res.data) {
      setFetching(false);
      return;
    }
    setActivityData({
      data: res.data,
      _id: res._id as DocumentId,
      _ref: res._ref as DocumentReference,
    });
    setFetching(false);
    await handleGetActivityParticipants(res.data.participants);
  }

  useEffect(() => {
    if (activityCode && user) {
      // Fetch activities at first times
      handleGetActivityByCode(activityCode);
    }
  }, [activityCode, user]);

  return (
    <>
      <LayoutAnimated title="Activity Tracking Detail" description="This application allow user to track their activities!">
        <div className="w-full max-w-[650px] m-auto pt-10">
          <SubPageHeader
            title="ActivityTracking"
            subTitle="getByCode"
            subTitleParams={[
              <span className="str" key={`activityTrackingDetail.subHeader.subTitle.params.code.${activityCode}`}>{activityCode}</span>
            ]}
            subTitleValue={(isAuthenticating || fetching) ? undefined : activityData?.data.name}
            description={(
              <>
                {"Actions with your activity"}
                {activityData ? (
                  <>
                    {', or '}
                    <span
                      className="font-bold underline cursor-pointer"
                      onClick={() => setEditModalVisible(true)}
                    >
                      {'edit'}
                    </span>
                    {' it.'}
                  </>
                ) : '.'}
              </>
            )}
          />
          
          {(!isAuthenticating && !fetching && !activityData) ? (
            <div className="w-full min-h-[100px] code comment ">
              Can not view this activity information because <b><u>it is not exist</u></b>!<br />
              <Link href="/a">Back!</Link>
            </div>
          ) : null}

          <ActivityParticipants
            data={activityData}
            loading={isAuthenticating || fetching}
            userMapping={activityParticipants}
          />


        </div>

      </LayoutAnimated>
      <Modal
        title={(
          <>
            <span className="var">a</span>
            {'.'}
            <span className="func">edit</span>
            {'('}
            <span className="str">{activityCode}</span>
            {')'}
          </>
        )}
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
      >
        <EditActivity
          data={activityData}
          onReUpdateData={d => {
            setEditModalVisible(false);
            setActivityData(d)
          }}
        />
      </Modal>
    </>
  )
};

export default withFirebaseAuth(ActivityTrackingDetail, true);
import { DocumentReference, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useReducer } from "react";
import { FormattedMessage } from "react-intl";
import CheckedInParticipants from "../../../components/ActivityTracking/CheckedInParticipants";
import CheckIn from "../../../components/ActivityTracking/CheckIn";
import EditActivity from "../../../components/ActivityTracking/Edit";
import ActivityParticipants from "../../../components/ActivityTracking/Participants";
import { useFirebaseAuth, withFirebaseAuth } from "../../../components/Firebase/FirebaseAuthWrapper";
import Modal from "../../../components/Modal";
import SubPageHeader from "../../../components/SubPageHeader";
import LayoutAnimated from "../../../components/wrapper/LayoutAnimated";
import { getActivityByCode } from "../../../utils/Firebase/services/activityTrackings";
import { getUsersByRefs } from "../../../utils/Firebase/services/user";
import useMessage from "../../../utils/international";
import { DocumentId, tActivityTracking, tDataTransformed, tUser } from "../../../utils/types/model";
import ModalActivityAddOns from "../../../components/ActivityTracking/AddOns";
import ActivityActions from "../../../components/ActivityTracking/Actions";

type tActivityDetailState = {
  activity?: tDataTransformed<tActivityTracking>;
  fetching: boolean;
  editModalVisible: boolean;
  checkInProgressModalVisible: boolean;
  participantsPath: string[];
  participantsInfo: Record<string, tDataTransformed<tUser>>;
  addOnsModalVisible: boolean;
}
const ActivityTrackingDetail = () => {
  const router = useRouter();
  const { message } = useMessage();
  const { user, isAuthenticating } = useFirebaseAuth();

  const [
    { activity, fetching, editModalVisible, checkInProgressModalVisible, participantsInfo, participantsPath, addOnsModalVisible },
    setState,
  ] = useReducer((p: tActivityDetailState, a: Partial<tActivityDetailState>) => {
    return { ...p, ...a};
  }, {
    activity: undefined,
    fetching: true,
    participantsPath: [],
    participantsInfo: {},
    editModalVisible: false,
    checkInProgressModalVisible: false,
    addOnsModalVisible: false,
  })

  const activityCode = useMemo(() => router.isReady ? router.query.code as string : undefined, [router.isReady, router.query.code]);
  const activityParticipants = useMemo(
    () => !!activity && activity.data.participants || [],
    [!!activity && (activity.data.participants || []).map(p => p.path).join()]
  );
  const activityParticipantsCheckedIn = useMemo(
    () => !!activity && activity.data.participantsCheckedIn || [],
    [!!activity && (activity.data.participantsCheckedIn || []).map(p => p.path).join()]
  );

  const handleGetParticipantsInfo = async (users: DocumentReference[]) => {
    const usersNeedGetInfo = users.filter(u => !participantsPath.includes(u.path));
    const usersNeedGetInfoPath = usersNeedGetInfo.map(p => p.path);

    const res = await getUsersByRefs(usersNeedGetInfo);

    setState({
      participantsPath: [...participantsPath, ...usersNeedGetInfoPath],
      participantsInfo: {
        ...participantsInfo,
        ...res,
      }
    });
  }

  useEffect(() => {
    if (!activity) {
      return;
    }
    handleGetParticipantsInfo(activity.data.participants);
  }, [activityParticipants.map(p => p.path).join()]);
  // New - End

  const handleGetActivityByCode = async (code: string) => {
    setState({ fetching: true });
    const res = await getActivityByCode(code, user as tDataTransformed<tUser>);
    if (!res || res.isError || !res.data) {
      setState({ fetching: false });
      return;
    }
    setState({
      activity: {
        data: res.data,
        _id: res._id as DocumentId,
        _ref: res._ref as DocumentReference,
      }
    });
    setState({ fetching: false });
  }

  useEffect(() => {
    if (activityCode && user) {
      // Fetch activities at first times
      handleGetActivityByCode(activityCode);
    }
  }, [activityCode, user]);

  useEffect(() => {
    if (!activity) {
      return;
    }
    const unSub = onSnapshot(
      activity._ref,
      (activitySnap) => {
        if (!activitySnap.exists()) {
          unSub();
          return;
        }
        const res = activitySnap.data() as tActivityTracking;
        setState({ activity: { ...activity, data: res } });
      },
      (err) => {
        console.error('[REALTIME] Something went wrong when listening for any change for activity:', err);
      }
    );

    return () => {
      unSub();
    }
  }, [activity?._id]);

  return (
    <>
      <LayoutAnimated title="Activity Tracking Detail" description="This application allow user to track their activities!">
        <div className="w-full max-w-[650px] m-auto pt-10">
          <SubPageHeader
            title="ActivityTracking"
            subTitle="joinByCode"
            subTitleParams={[
              <span className="str" key={`activityTrackingJoin.subHeader.subTitle.params.code.${activityCode}`}>{activityCode}</span>
            ]}
            subTitleValue={(isAuthenticating || fetching) ? undefined : activity?.data.name}
            description={(
              <>
                <FormattedMessage id="activityTracking.actions.desc" />
                {activity ? (
                  <>
                    {' '}
                    <span
                      className="font-bold underline cursor-pointer"
                      onClick={() => setState({ editModalVisible: true })}
                    >
                      <FormattedMessage id="word.edit-it" />
                    </span>
                    {', '}
                    <FormattedMessage id="word.or" />
                    {' '}
                    <span
                      className="font-bold underline cursor-pointer"
                      onClick={() => setState({ addOnsModalVisible: true })}
                    >
                      <FormattedMessage id="activityTracking.addOns.add" />
                    </span>
                    {'.'}
                  </>
                ) : '.'}
              </>
            )}
          />
          
          {(!isAuthenticating && !fetching && !activity) ? (
            <div className="w-full min-h-[100px] code comment ">
              <FormattedMessage
                id="error.activityTracking.html.no-view"
                values={{
                  b: (c) => <b>{c}</b>
                }}
              />
              <br />
              <Link href="/a">
                {message('word.back')}
              </Link>
            </div>
          ) : null}

          <ActivityParticipants
            data={activityParticipants}
            dic={participantsInfo}
            loading={isAuthenticating || fetching}
            className="mb-5"
          />

          <CheckIn
            data={activityParticipantsCheckedIn}
            activityRef={activity?._ref}
            isAllowCheckIn={!!activity?.data.checkInAvailable}
            fetching={isAuthenticating || fetching}
            isOwner={!!activity && !!user && activity.data.createdBy.path === user._ref.path}
            onStarted={() => setState({ checkInProgressModalVisible: true })}
            className="mb-5"
          />

          <ActivityActions data={activity?.data.actions} userMapping={participantsInfo} />
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
        onClose={() => setState({ editModalVisible: false })}
      >
        <EditActivity
          data={activity}
          onDone={() => setState({ editModalVisible: false })}
        />
      </Modal>
      <Modal
        title={(
          <>
            <span className="var">a</span>
            {'.'}
            <span className="func">checkIn</span>
            {'('}
            <span className="str">{activityCode}</span>
            {')'}
          </>
        )}
        visible={checkInProgressModalVisible}
        onClose={() => setState({ checkInProgressModalVisible: false })}
      >
        <CheckedInParticipants
          data={activityParticipantsCheckedIn}
          dic={participantsInfo}
          isListening={activity?.data.checkInAvailable}
        />
      </Modal>
      <ModalActivityAddOns
        visible={addOnsModalVisible}
        onClose={() => setState({ addOnsModalVisible: false })}
        data={activity}
      />
    </>
  )
};

export default withFirebaseAuth(ActivityTrackingDetail, true);
import { useEffect, useState } from "react";
import CreateActivityCard from "../../components/ActivityTracking/Create";
import JoinActivityCard from "../../components/ActivityTracking/Join";
import ActivitiesList from "../../components/ActivityTracking/List";
import { useFirebaseAuth, withFirebaseAuth } from "../../components/Firebase/FirebaseAuthWrapper";
import SubPageHeader from "../../components/SubPageHeader";
import LayoutAnimated from "../../components/wrapper/LayoutAnimated";
import { getActivities } from "../../utils/Firebase/services/activityTrackings";
import { tActivityTracking, tDataTransformed, tUser } from "../../utils/types/model";

const ActivityTracking = () => {
  const { user, isAuthenticating } = useFirebaseAuth();
  const [activities, setActivities] = useState<tDataTransformed<tActivityTracking>[]>([]);
  const [fetching, setFetching] = useState<boolean>(true);

  const handleGetActivities = async () => {
    setFetching(true);
    const res = await getActivities(user as tDataTransformed<tUser>);
    if (res.isError || !Array.isArray(res.data)) {
      setFetching(false);
      return;
    }
    setActivities(res.data);
    setFetching(false);
  }

  useEffect(() => {
    // Fetch activities at first times
    if (user) {
      handleGetActivities();
    }
  }, [user]);

  return (
    <LayoutAnimated title="Activity Tracking" description="This application allow user to track their activity!">
      <div className="w-full max-w-[650px] m-auto pt-10">
        <SubPageHeader title="ActivityTracking" description="This application allow user to track their activities." />
        <CreateActivityCard
          goToDetailAfterCreated
          disabled={isAuthenticating || !user}
          className="mb-5"
        />
        <JoinActivityCard
          goToDetailAfterJoined
          disabled={isAuthenticating || !user}
          className="mb-5"
        />
        <ActivitiesList
          items={activities}
          onGetActivities={handleGetActivities}
          loading={isAuthenticating || fetching}
        />
      </div>
    </LayoutAnimated>
  )
};

export default withFirebaseAuth(ActivityTracking);
import { useEffect, useMemo, useReducer } from "react";
import { getActions4ActivityByRefs, tActionMapping4Activity, tActivityActionsWithType } from "../../utils/Firebase/services/activityAddOns";
import { tActivityActions, tActivityPoll, tActivityTracking, tDataTransformed, tUser } from "../../utils/types/model";
import Poll from "./AddOns/Poll";

interface iActivityActions {
  data?: tActivityTracking['actions'];
  userMapping: tUserMapping;
}
type tActivityActionsState = {
  actionMapping: tActionMapping4Activity;
};
type tUserMapping = Record<string, tDataTransformed<tUser>>;
const defaultActivityActionsState: tActivityActionsState = {
  actionMapping: {},
};
const ActivityActions: React.FC<iActivityActions> = ({ data, userMapping }) => {
  const actionKeys = useMemo(
    () => (data || []).map(a => a.ref.path),
    [(data || []).map(a => a.ref.path).join()]
  );
  const [{ actionMapping }, setState] = useReducer(
    (p: tActivityActionsState, a: Partial<tActivityActionsState>) => ({ ...p, ...a }),
    defaultActivityActionsState
  );

  const handleReGetNewActions = async (a: tActivityTracking['actions']) => {
    const newMapping = await getActions4ActivityByRefs(a);
    setState({ actionMapping: { ...actionMapping, ...newMapping } });
  }
  const handleUpdateNewActionData = (k: string) => (data: tDataTransformed<tActivityActions>) => {
    if (!actionMapping[k]) {
      return;
    }
    setState({
      actionMapping: {
        ...actionMapping,
        [k]: {
          ...actionMapping[k],
          data,
        }
      }
    })
  }

  useEffect(() => {
    const actionRefsNeedUpdate = (data || [])
      .filter(a => !actionMapping[a.ref.path]);
    if (actionRefsNeedUpdate.length === 0) {
      return;
    }
    handleReGetNewActions(actionRefsNeedUpdate);
  }, [actionKeys.join()]);


  return (
    <div className="">
      {Object.keys(actionMapping).map(k => (
        <ActionRender
          type={actionMapping[k].type}
          data={actionMapping[k].data}
          userMapping={userMapping}
          onDataChange={handleUpdateNewActionData(k)}
          key={k}
        />
      ))}
    </div>
  )
};

const ActionRender: React.FC<tActivityActionsWithType & {
  userMapping: tUserMapping,
  onDataChange?: (newData: tDataTransformed<tActivityPoll>) => void;
}> = ({ type, data, userMapping, onDataChange }) => {
  if (!type || !data) {
    return null;
  }
  if (type === "poll") {
    return (
      <Poll data={data} userMapping={userMapping} onDataChange={onDataChange} />
    )
  }
  return null;
}

export default ActivityActions;
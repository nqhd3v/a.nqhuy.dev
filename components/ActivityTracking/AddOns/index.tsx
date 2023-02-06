import { tActivityTracking, tDataTransformed } from "../../../utils/types/model";
import ModalFeatures, { iModalFeatures } from "../../ModalFeatures";
import AddPollForm from "./AddPoll";



interface iActivityAddOns {
  visible?: boolean;
  onClose?: iModalFeatures['onClose'];
  data?: tDataTransformed<tActivityTracking>;
}
const ModalActivityAddOns: React.FC<iActivityAddOns> = ({ data, visible, onClose }) => {

  return (
    <ModalFeatures
      visible={visible}
      onClose={onClose}
      data={{ activityRef: data?._ref }}
      tabs={[
        {
          key: 'activity-poll',
          title: 'Poll',
          icon: 'fas fa-chart-simple',
          content: <AddPollForm />
        }
      ]}
      fullScreen
    />
  )
}

export default ModalActivityAddOns;
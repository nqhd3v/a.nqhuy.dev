import { DocumentReference } from "firebase/firestore";
import { FormattedMessage } from "react-intl";
import useMessage from "../../utils/international";
import { tDataTransformed, tUser } from "../../utils/types/model";

interface iCheckedInParticipants {
  data: DocumentReference[],
  dic: Record<string, tDataTransformed<tUser>>;
  isListening?: boolean;
}
const CheckedInParticipants: React.FC<iCheckedInParticipants> = ({ data, dic, isListening }) => {
  const { message } = useMessage();

  return (
    <div className="w-full px-5 text-dark dark:text-light">
      <div className="code comment mb-2">
        {isListening ? message('activityTracking.checkIn.waiting') : message('activityTracking.checkIn.count', { count: data.length })}
      </div>
      <div className="flex flex-wrap">
        {data.map(p => {
          const info = dic[p.id];
          return (
            <div className="px-5 h-8 mr-2 mt-2 flex items-center rounded font-bold bg-blue-200 dark:bg-dark-800" key={`activityTracking.checkIn.list.user.${p.id}.${info ? 'info' : 'preview'}`}>
              {info ? info.data.displayName : '--'}
            </div>
          )
        })}
        {isListening ? (
          <div className="w-[100px] h-8 mr-2 mt-2 rounded bg-gray-400/30 dark:bg-gray-600/30 animate-pulse" />
        ) : null}
      </div>
    </div>
  )
};

export default CheckedInParticipants;
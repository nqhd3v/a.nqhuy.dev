import moment from "moment";
import { useRouter } from "next/router";
import { fsTimestamp2Date } from "../../utils/func/mapping";
import { tActivityTracking, tDataTransformed } from "../../utils/types/model";
import SquareBracketAction from "../SquareBracket";
import { withBoundary } from "../wrapper/ErrorBoundary";

const ActivityListItem = ({ data }: { data: tDataTransformed<tActivityTracking> }) => {
  const router = useRouter();
  const startedAt = data.data.startedAt ? moment(fsTimestamp2Date(data.data.startedAt)) : undefined;
  const finishedAt = data.data.finishedAt ? moment(fsTimestamp2Date(data.data.finishedAt)) : undefined;
  return (
    <div
      className={
        "relative w-full px-5 py-1 border border-t-gray-300 border-b-gray-300 dark:border-t-gray-800 dark:border-b-gray-800 border-gray-400 dark:border-gray-600 " +
        "before:content-[''] before:w-px before:h-px before:bg-gray-400 dark:before:bg-gray-600 before:-left-px before:top-1/2 before:-translate-y-1/2 before:absolute before:duration-300 " +
        "after:content-[''] after:w-px after:h-px after:bg-gray-400 dark:after:bg-gray-600 after:-right-px after:top-1/2 after:-translate-y-1/2 after:absolute after:duration-300 " +
        "hover:before:-left-1.5 hover:before:w-0.5 hover:before:h-[calc(100%-16px)] " +
        "hover:after:-right-1.5 hover:after:w-0.5 hover:after:h-[calc(100%-16px)] "
      }
      onClick={() => router.push(`/a/${data.data.code}`)}
    >
      <div className="text-xl font-bold">{data.data.name}</div>
      <div className="code comment text-sm">
        {startedAt && finishedAt
          ? startedAt.format('DD/MM/YYYY HH:mm') + ' - ' + finishedAt.format('DD/MM/YYYY HH:mm')
          : 'no time'}
      </div>
    </div>
  )
}

interface iActivitiesList {
  items: tDataTransformed<tActivityTracking>[];
  onGetActivities: () => Promise<void> | void;
  loading?: boolean;
}
const ActivitiesList: React.FC<iActivitiesList> = ({ items, onGetActivities, loading }) => {
  return (
    <div className="relative grid grid-cols-1 gap-2">
      <div className="border border-b-gray-300 dark:border-b-gray-800 border-gray-400 dark:border-gray-600 rounded-md rounded-bl-none rounded-br-none p-5 pb-2">
        <div className="code font-bold text-2xl">
          <span className="var">a</span>
          {'.'}
          <span className="func">get</span>
          {'()'}
        </div>
        <div className="code comment text-sm flex items-center">
          <span>
            {'All activities you have been joined'}
            {' - '}
            <i>{loading ? 'loading latest data...' : 'latest data'}</i>
          </span>
          <SquareBracketAction onClick={onGetActivities} disabled={loading} content="sync" className="ml-auto" />
        </div>
      </div>
      {items.map(item => <ActivityListItem data={item} key={item._id} />)}
      <div className="border border-t-gray-300 dark:border-t-gray-800 border-gray-400 dark:border-gray-600 rounded-md rounded-tl-none rounded-tr-none h-5" />
    </div>
  )
};

export default withBoundary<iActivitiesList>(ActivitiesList);

import { DocumentReference } from "firebase/firestore";
import Image from "next/image";
import React from "react";
import { FormattedMessage } from "react-intl";
import { tActivityTracking, tDataTransformed, tUser } from "../../utils/types/model";

interface iActivityParticipants {
  className?: string;
  data?: DocumentReference[];
  dic: Record<string, tDataTransformed<tUser>>;
  loading?: boolean;
}

const ActivityParticipants: React.FC<iActivityParticipants> = ({ className, data, dic, loading }) => {
  if (loading) {
    return (
      <div
        className={
          "relative h-10 flex items-center justify-between " +
          "before:content-[''] before:h-px before:w-full before:bg-gray-400/30 dark:before:bg-gray-600/30 before:top-1/2 before:-translate-y-1/2 before:absolute before:left-0 before:-z-[1] " +
          (className || '')
        }>
        <div className="flex items-center pr-3 bg-blue-100 dark:bg-dark">
          {[0, 1, 2, 3, 4].map(key => (
            <div className="relative h-9 w-9 -ml-3 first:ml-0 rounded-full border-4 border-blue-100 dark:border-dark overflow-hidden bg-blue-100 dark:bg-dark" key={`activity.sum-up.user-list.preload.${key}`}>
              <div className="absolute top-0 left-0 h-full w-full rounded-full animate-pulse bg-gray-400/30 dark:bg-gray-600/30" />
            </div>
          ))}
        </div>
        <div className="pl-3 bg-blue-100 dark:bg-dark">
          <div className="w-[100px] h-4 rounded animate-pulse bg-gray-400/30 dark:bg-gray-600/30" />
        </div>
      </div>
    )
  }
  if (!Array.isArray(data)) {
    return null;
  }
  return (
    <div
      className={
        "relative h-10 flex items-center justify-between " +
        "before:content-[''] before:h-px before:w-full before:bg-gray-400/30 dark:before:bg-gray-600/30 before:top-1/2 before:-translate-y-1/2 before:absolute before:left-0 before:-z-[1] " +
        (className || '')
      }>
      <div className="flex items-center pr-3 bg-blue-100 dark:bg-dark">
        {data.map(user => (
          <div className="relative h-9 w-9 -ml-3 first:ml-0 rounded-full border-4 border-blue-100 dark:border-dark overflow-hidden bg-blue-100 dark:bg-dark" key={`activity.sum-up.user-list.${user.id}`}>
            {dic[user.id] ? (<Image
              width={36}
              height={36}
              src={dic[user.id].data.photoURL || '/'}
              alt=""
            />) : (
              <div className="absolute top-0 left-0 h-full w-full rounded-full animate-pulse bg-gray-400/30 dark:bg-gray-600/30" />
            )}
          </div>
        ))}
      </div>
      <span className="text-gray-400 dark:text-gray-600 font-bold bg-blue-100 dark:bg-dark pl-3">
        <FormattedMessage
          id="activityTracking.participants.count"
          values={{ count: data.length }}
        />
      </span>
    </div>
  )
};

export default ActivityParticipants;
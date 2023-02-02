import useMessage from "../../utils/international";

interface iAddOnBadge {
  icon: string;
  title: string;
  desc: string;
}
const AddOnBadge: React.FC<iAddOnBadge> = ({ icon, title, desc }) => {
  return (
    <div className="group rounded-md border-2 border-blue-500 dark:border-blue-800 p-3 flex space-x-3">
      <div className="relative w-10 h-10 border border-dashed border-blue-500 dark:border-blue-800 flex items-center justify-center">
        <i className={`${icon} text-md group-hover:text-xl duration-300`} />
      </div>
      <div className="text-base">
        <div className="font-bold text-dark dark:text-light">{title}</div>
        <div className="italic text-gray-400 dark:text-gray-600">{desc}</div>
      </div>
    </div>
  )
}

interface iActivityAddOns {
  
}
const ActivityAddOns: React.FC<iActivityAddOns> = () => {
  const { message } = useMessage();

  return (
    <div className="w-full">
      <div className="font-bold text-dark dark:text-light mb-1">{message('activityTracking.addOns.add')}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <AddOnBadge icon="" title="" desc="" />
      </div>
    </div>
  )
}

export default ActivityAddOns;
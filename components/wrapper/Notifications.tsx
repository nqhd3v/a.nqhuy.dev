import { AnimatePresence, motion } from "framer-motion"
import { createContext, useContext, useEffect, useState } from "react";
import { genKey } from "../../utils/func/random";
import { tComponentWrapper } from "../../utils/types/sample";

export type tNotification = {
  title: string | JSX.Element;
  description: string | JSX.Element;
  id: string;
  _type?: "error";
  _autoHide?: number;
}

interface iNotificationCard {
  data: tNotification;
  onRemove: () => void;
}

type tNotificationAddData = {
  title: tNotification['title'];
  description: tNotification['description'];
};

type tNotificationAddConfig = {
  type?: tNotification['_type'];
}

type tNotificationContext = {
  items: tNotification[],
  add: (data: tNotificationAddData, config?: tNotificationAddConfig) => void;
  remove: (id: string) => void;
}
export const NotificationContext = createContext<tNotificationContext>({
  items: [],
  add: () => {},
  remove: () => {},
});
export const useNotification = () => {
  return useContext(NotificationContext);
}

const NotificationCard: React.FC<iNotificationCard> = ({ data, onRemove }) => {
  useEffect(() => {
    const hideAfter = data._autoHide === undefined || data._autoHide < 0 ? 5 : data._autoHide;
    // In case `data._autoHide = 0` it will show forever!
    if (hideAfter) {
      setTimeout(() => onRemove(), hideAfter * 1000);
    }
  }, []);

  return (
    <motion.li
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.2 }}
      className="relative p-5 rounded-md bg-white dark:bg-dark-700 list-none shadow-md"
    >
      <div
        className={
          "absolute top-5 right-5 " +
          "w-8 h-8 rounded-full cursor-pointer border border-slate-400 text-dark dark:text-white " +
          "flex justify-center items-center "
        }
        onClick={() => onRemove()}
      >
        <i className="fas fa-times" />
      </div>
      <div
        className={
          "pr-10 font-bold dark:text-white text-xl mb-2 " +
          (data?._type === "error" ? "text-red-400 dark:text-red-300 " : "")
        }
      >
        {data.title}
      </div>
      <div className="text-md dark:text-slate-400">{data.description}</div>
    </motion.li>
  )
}

const Notifications = ({ children }: tComponentWrapper) => {
  const [notifications, setNotifications] = useState<tNotification[]>([]);

  const addNotification: tNotificationContext['add'] = ({ title, description }, config) => {
    const id = genKey();
    const newItem: tNotification = { title, description, id, _type: config?.type };
    const newList = [ ...notifications, newItem];
    setNotifications(newList);
    // Max is 3 items
    if (notifications.length > 2) {
      setTimeout(() => {
        const [_, ...currentNotifies] = newList;
        setNotifications([...currentNotifies]);
      }, 500);
    } 
  }
  const removeNotification: tNotificationContext['remove'] = (id) => {
    const newNotifications = notifications.filter(notify => notify.id !== id);
    setNotifications(newNotifications);
  }
  
  const notificationsRendered = notifications.map(notify => (
    <NotificationCard
      key={notify.id}
      data={notify}
      onRemove={() => removeNotification(notify.id)}
    />
  ));

  return (
    <NotificationContext.Provider value={{ items: Object.values(notifications), add: addNotification, remove: removeNotification }}>
      {children}

      <motion.ul className="fixed top-[60px] right-5 w-[400px] space-y-3">
        <AnimatePresence initial={false}>
          {notificationsRendered}
        </AnimatePresence>
      </motion.ul>
    </NotificationContext.Provider>
  )
}

export const withNotifications = (Component: React.ComponentType) => {
  const ComponentWithNotifications = () => (
    <Notifications>
      <Component />
    </Notifications>
  );
  
  return ComponentWithNotifications;
}

export default Notifications;
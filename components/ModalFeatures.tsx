import { AnimatePresence, motion as m } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";

const CloseBtn: React.FC<{ onClose: () => void, position?: "right" | "left" }> = ({ onClose, position }) => (
  <button
    onClick={onClose}
    className={
      "absolute top-3.5 w-7 h-7 rounded-full text-lg duration-300 " +
      (position === "left" ? "left-0 " : "right-0 ") +
      "bg-dark/10 dark:bg-blue-100/10 hover:bg-dark/20 dark:hover:bg-blue-100/20 text-dark dark:text-light " +
      "flex justify-center items-center "
    }
  >
    <i className="fas fa-times" />
  </button>
)

const modalVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

type tModalFeature = {
  key: string;
  icon?: string;
  title: string;
  description?: string;
  content: JSX.Element;
};
export interface iModalFeatures {
  title?: (JSX.Element | string)[] | JSX.Element | string;
  closable?: boolean;
  backdropClosable?: boolean;
  visible?: boolean;
  tabs: tModalFeature[];
  currentTab?: string;
  onClose?: () => void;
  onSelectTab?: (tabKey: string) => void;
  fullScreen?: boolean;
  data?: Record<string, any>;
}
const ModalFeatures: React.FC<iModalFeatures> = ({ tabs, currentTab, fullScreen, data, onSelectTab, visible, title, closable, backdropClosable, onClose }) => {
  const [localCurrentTab, setLocalCurrentTab] = useState<string>('');

  const handleSelectTab = (k: string) => {
    if (k === localCurrentTab) {
      setLocalCurrentTab('');
      onSelectTab?.('');
      return;
    }
    setLocalCurrentTab(k);
    onSelectTab?.(k);
  }

  const tabsMapping = useMemo(() => {
    const res: Record<tModalFeature['title'], tModalFeature> = {};
    tabs.forEach(t => {
      res[t.key] = t;
    });
    return res;
  }, [tabs.map(t => t.key).join()]);

  useEffect(() => {
    if (currentTab !== undefined && currentTab !== localCurrentTab) {
      setLocalCurrentTab(currentTab);
    }
  }, [currentTab]);

  const handleClose = () => {
    onClose?.();
  }

  const isClosable = (closable === undefined || closable);

  return (
    <AnimatePresence mode="wait">
      {visible ? (<m.div
        onClick={() => backdropClosable ? onClose?.() : null}
        className={
          "fixed overflow-hidden top-0 left-0 w-full h-screen bg-blue-100/30 dark:bg-dark/30 backdrop-blur-sm flex justify-center " +
          (fullScreen ? "pt-[60px] " : "items-center ")
        }
        variants={modalVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{duration: .2}}
      >
        <m.div
          onClick={(e) => e.stopPropagation()}
          className={
            "relative bg-blue-100 dark:bg-dark border border-gray-400 dark:border-gray-600 rounded-md min-h-[100px] " +
            (fullScreen ? "h-[calc(100vh-80px)] " : "") +
            "w-[calc(100%-40px)] shadow-md"
          }
          variants={modalVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: .2 }}
        >
          {title ? (
            <div className="code text-2xl font-bold py-3 px-5 border-b border-gray-400 dark:border-gray-600">{title}</div>
          ) : null}
          <div className="flex h-full">
            <div className="w-[240px] h-full p-2 pr-0 overflow-x-hidden overflow-y-auto">
              {(!title && isClosable) ? (
                <div className="relative w-full h-14">
                  <CloseBtn position="left" onClose={handleClose} />
                </div>
              ) : null}
              {tabs.map(t => (
                <div
                  className={
                    "rounded-md p-2 space-x-2 " +
                    "flex items-center cursor-pointer " +
                    "border duration-300 border-gray-400 dark:border-gray-600 hover:border-dark dark:hover:border-light " +
                    (t.key === localCurrentTab
                      ? "bg-light dark:bg-dark-700 border-gray-400 dark:border-gray-600 "
                      : ""
                    )
                  }
                  key={t.key}
                  onClick={() => handleSelectTab(t.key)}
                >
                  {t.icon ? (
                    <div
                      className={
                        "relative w-8 h-8 " +
                        "border border-dashed border-blue-500 dark:border-dark-400 text-blue-500 dark:text-blue-300 " +
                        "flex items-center justify-center"
                      }
                    >
                      <i className={`${t.icon} text-xl`} />
                    </div>
                  ): (
                    <div className="w-10 h-10" />
                  )}
                  <div className="font-bold text-dark dark:text-light">{t.title}</div>
                </div>
              ))}
            </div>
            <div className="w-[calc(100%-200px)] flex-1 p-2">
              <AnimatePresence mode="wait">
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0}}
                  transition={{ duration: .1 }}
                  key={`modal-feature.content-for-${tabsMapping[localCurrentTab]?.key || 'nothing'}`}
                  className="flex-1 w-full h-full"
                >
                  {React.isValidElement(tabsMapping[localCurrentTab]?.content)
                    ? React.cloneElement(tabsMapping[localCurrentTab].content, { data, onCloseModal: handleClose })
                    : null
                  }
                </m.div>
              </AnimatePresence>
            </div>
          </div>

          {(title && isClosable) ? (
            <CloseBtn onClose={handleClose} />
          ) : null}
        </m.div>
      </m.div>) : null}
    </AnimatePresence>
  )
}

export default ModalFeatures;
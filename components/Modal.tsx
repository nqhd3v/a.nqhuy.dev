import { AnimatePresence, motion as m } from "framer-motion";

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

interface iModal {
  children: (JSX.Element | string)[] | JSX.Element | string;
  onClose?: () => void;
  title?: (JSX.Element | string)[] | JSX.Element | string;
  closable?: boolean;
  backdropClosable?: boolean;
  visible?: boolean;
}
const Modal: React.FC<iModal> = ({ children, visible, title, closable, backdropClosable, onClose }) => {
  const handleClose = () => {
    onClose?.();
  }

  return (
    <AnimatePresence mode="wait">
      {visible ? (<m.div
        onClick={() => backdropClosable ? onClose?.() : null}
        className="fixed overflow-hidden top-0 left-0 w-full h-screen bg-blue-100/30 dark:bg-dark/30 backdrop-blur-sm flex justify-center items-center"
        variants={modalVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{duration: .2}}
      >
        <m.div
          onClick={(e) => e.stopPropagation()}
          className={
            "relative bg-blue-100 dark:bg-dark border border-gray-400 dark:border-gray-600 rounded-md min-h-[100px] pb-5 " +
            "w-[calc(100%-40px)] max-w-[650px] shadow-md"
          }
          variants={modalVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: .2 }}
        >
          {title ? (
            <div className="code text-2xl font-bold py-3 px-5">{title}</div>
          ) : null}
          {children}
          {(closable === undefined || closable) ? (
            <button
              onClick={handleClose}
              className={
                "absolute top-3.5 right-5 w-7 h-7 rounded-full text-lg duration-300 " +
                "bg-dark/10 dark:bg-blue-100/10 hover:bg-dark/20 dark:hover:bg-blue-100/20 text-dark dark:text-light " +
                "flex justify-center items-center "
              }
            >
              <i className="fas fa-times" />
            </button>
          ) : null}
        </m.div>
      </m.div>) : null}
    </AnimatePresence>
  )
}

export default Modal;
import { motion as m } from 'framer-motion';
import { useMemo } from 'react';
import { layoutContentClasses } from '../utils/constants';

interface iSubPageHeader {
  title: string;
  description: string;
}

const SubPageHeader: React.FC<iSubPageHeader> = ({ title, description }) => {
  const titleVariableName = useMemo(() => title[0].toLowerCase(), [title]);

  return (
      <div
        className={
          "pt-3.5 sm:pt-5 mb-10 " +
          layoutContentClasses
        }
      >
        <div className="overflow-hidden relative mb-2">
          <m.div
            initial={{ y: 48 }}
            animate={{ y: 0 }}
            exit={{ y: 48 }}
            transition={{ duration: .3, delay: .5 }}
            className="code text-3xl md:text-4xl xl:text-5xl font-bold text-blue-400"
          >
            {titleVariableName}
            <span className="text-blue-900 dark:text-blue-100">
              {" = "}
            </span>
            <span className="text-blue-500 dark:text-blue-600">
              {"new "}
            </span>
            <span className="text-yellow-600 dark:text-yellow-500">
              {title}
            </span>
            <span className="text-blue-900 dark:text-blue-100">
              {"();"}
            </span>
          </m.div>
        </div>
        <div className="overflow-hidden relative">
          <m.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: .3, delay: .8 }}
            className="code comment"
          >
            {description}
          </m.div>
        </div>
      </div>
  )
}

export default SubPageHeader;
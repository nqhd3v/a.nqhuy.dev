import { AnimatePresence, motion as m } from 'framer-motion';
import { useMemo } from 'react';
import { layoutContentClasses } from '../utils/constants';
import ErrorBoundary from './wrapper/ErrorBoundary';

interface iSubPageHeader {
  title: string;
  subTitle?: string;
  subTitleParams?: (JSX.Element | string)[] | JSX.Element | string;
  subTitleValue?: string;
  description: (JSX.Element | string)[] | JSX.Element | string;
}

const SubPageHeader: React.FC<iSubPageHeader> = ({ title, subTitle, subTitleParams, subTitleValue, description }) => {
  const titleVariableName = useMemo(() => title[0].toLowerCase(), [title]);
  const titleKey = useMemo(() => {
    if (subTitleValue) return `sub-page-header.title.func`;
    if (subTitle) return `sub-page-header.title.class`;
    return `sub-page-header.sub-title.unknown`;
  }, [subTitle, subTitleValue]);
  const subTitleKey = useMemo(() => {
    if (subTitleValue) return `sub-page-header.sub-title.value`;
    if (subTitle) return `sub-page-header.sub-title.func`;
    return `sub-page-header.sub-title.class`;
  }, [subTitle, subTitleValue]);

  const titleContent = () => {
    if (subTitleValue) {
      return (
        <>
          {titleVariableName}
          {'.'}
          <span className="func">{subTitle}</span>
          {'('}
          {subTitleParams}
          {')'}
        </>
      )
    }
    if (subTitle) {
      return (
        <>
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
        </>
      )
    }
    return null;
  }
  const subTitleContent = () => {
    if (subTitleValue) {
      return (
        <span className="str">{subTitleValue}</span>
      );
    }
    if (subTitle) {
      return (
        <>
          {titleVariableName}
          {'.'}
          <span className="func">{subTitle}</span>
          {'('}
          {subTitleParams}
          {')'}
        </>
      )
    }
    return (
      <>
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
      </>
    )
  }

  return (
    <ErrorBoundary>
      <div
        className={
          "pt-3.5 sm:pt-5 mb-5 " +
          layoutContentClasses
        }
      >
        <div className="overflow-hidden relative h-7 opacity-50">
          <AnimatePresence mode="wait">
            <m.div
              initial={{ y: 28 }}
              animate={{ y: 0 }}
              exit={{ y: -28 }}
              transition={{ duration: .5 }}
              className="code text-lg font-bold"
              key={titleKey}
            >
              {titleContent()}
            </m.div>
          </AnimatePresence>
        </div>
        <div className="overflow-hidden relative h-9 md:h-10 xl:h-12">
          <AnimatePresence mode="wait">
            <m.div
              initial={{ y: 48 }}
              animate={{ y: 0 }}
              exit={{ y: -48 }}
              transition={{ duration: .5 }}
              className="code text-3xl md:text-4xl xl:text-5xl font-bold"
              key={subTitleKey}
            >
              {subTitleContent()}
            </m.div>
          </AnimatePresence>
        </div>
        <div className="overflow-hidden relative">
          <AnimatePresence mode='wait'>
            <m.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: .3, delay: .3 }}
              className="code comment"
            >
              {description}
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default SubPageHeader;
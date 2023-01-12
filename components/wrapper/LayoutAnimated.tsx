import React, { ReactNode } from 'react';
import { NextSeo } from 'next-seo';
import { motion } from 'framer-motion';

interface ILayoutAnimated {
  children: ReactNode;
  title: string;
  description: string;
}

const LayoutAnimated: React.FC<ILayoutAnimated> = ({ children, title, description }) => (
  <div className='w-full overflow-x-hidden'>
    <NextSeo title={title} description={description} openGraph={{ title, description }} />
    <motion.main
      initial={{ opacity: 0, x: -200 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 200 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className={
        "text-blue-900 dark:text-blue-200 w-full " +
        "px-5 " +
        "sm:px-[80px] "
      }
    >
      {children}
    </motion.main>
  </div>
)

export default LayoutAnimated;
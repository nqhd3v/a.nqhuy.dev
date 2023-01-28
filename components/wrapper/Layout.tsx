import React, { ReactNode } from 'react';
import { NextSeo } from 'next-seo';
import { withBoundary } from './ErrorBoundary';

interface iLayout {
  children: ReactNode;
  title: string;
  description: string;
}

const Layout: React.FC<iLayout> = ({ children, title, description }) => (
  <div className='w-full overflow-x-hidden'>
    <NextSeo title={title} description={description} openGraph={{ title, description }} />
    <main
      className="text-blue-900 dark:text-blue-200 w-full"
    >
      {children}
    </main>
  </div>
)

export default withBoundary<iLayout>(Layout);
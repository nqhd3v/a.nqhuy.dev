import React, { useEffect } from 'react';
import Head from 'next/head';
import { DefaultSeo } from 'next-seo';
import { AnimatePresence } from 'framer-motion';
import type { AppProps } from 'next/app';

import "../public/fontawesome/css/all.min.css";
import "react-datepicker/dist/react-datepicker.min.css";
import "../styles/datepicker.css";
import '../styles/globals.css'
import { GlobalDebug } from '../utils/func/disableLog';

function MyApp({ Component, pageProps, router }: AppProps) {
  const url = `https://a.nqhuy.dev${router.route}`;

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Disable log in production mode.
    if (process.env.NODE_ENV === "production") {
      console.info('Disabled log in production mode!');
      GlobalDebug(false);
    }
  }, []);
  
  // Handle error here
  if (router.pathname === "/404") {
    return (
      <>
        <Head>
          <link rel="icon" href="/favicon.png" type="image/png" />
        </Head>
        <Component {...pageProps} canonical={url} key={url} />
      </>  
    )
  }

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>
      <DefaultSeo
        titleTemplate="%s - My Stupid Apps"
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url,
          description: 'This page was created to recap about all my stupid applications.',
          site_name: 'Huy Nguyen\'s Stupid Apps | a.nqhuy.dev',
          images: [],
        }}
        canonical={url}
      />
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <Component {...pageProps} canonical={url} key={url} />
      </AnimatePresence>
    </>
  )
}

export default MyApp

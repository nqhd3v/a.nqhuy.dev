import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Moon from './Icons/Moon';
import Sun from './Icons/Sun';

const isDarkModeActivated = (): boolean =>
  (localStorage && localStorage.theme === 'dark') ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

const getThemeString = (isDark: boolean): string => (isDark ? 'dark' : 'light')

interface iDarkModeToggle {
  className?: string;
}

const DarkModeToggle: React.FC<iDarkModeToggle> = ({ className }) => {
  const [isDarkMode, setDarkMode] = useState<boolean>(false);

  const toggleMode = (): void => {
    localStorage.theme = getThemeString(!isDarkMode)
    if (localStorage.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setDarkMode(!isDarkMode)
  }

  useEffect(() => {
    setDarkMode(isDarkModeActivated());
  }, [])

  const darkModeActivated: boolean =
    typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  return (
    <button
      className={`no-default bottom-border w-11 h-11 ${className || ''}`}
      onClick={toggleMode}
      aria-label="Dark mode toggle"
    >
      <AnimatePresence
        mode="wait"
        initial={false}
      >
        <motion.div
          key={darkModeActivated ? 'moon-icon' : 'sun-icon'}
          initial={{ x: 8, y: 36 }}
          animate={{ x: 8, y: 0 }}
          exit={{ x: 8, y: 36 }}
          transition={{ duration: .5 }}
          className="w-7 h-7"
        >
          {darkModeActivated ? <Sun size={28} color="#fff" /> : <Moon size={28} />}
        </motion.div>
      </AnimatePresence>
    </button>
  )
}

export default DarkModeToggle;
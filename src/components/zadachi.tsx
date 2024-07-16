import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './header';
import Grafik from './grafik';
import Krug from './krug'


const Chart = () => {
  const [language, setLanguage] = useState<'RU' | 'EN'>('RU');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleLanguageChange = (lang: 'RU' | 'EN') => {
    setLanguage(lang);
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    console.log(`Theme changed to: ${theme}`);
    if (!setTheme) {
      console.error('setTheme is not defined');
      return;
    }
    setTheme(theme);
    if (!document.documentElement) {
      console.error('document.documentElement is null');
      return;
    }
    document.documentElement.classList.toggle('dark-mode', theme === 'dark');
  };

  return (
    <div className='boxx' >
      <Header language={language} onLanguageChange={handleLanguageChange} onThemeChange={handleThemeChange}/>
      <Grafik language={language} />
      <Krug/>
    </div>
  );
};

export default Chart;
import React, { useState } from 'react';
import CommentList from './components/comments.tsx';
import Dizigner from './components/Topdizigner.tsx';
import Header from './components/header.tsx';
import './App.css'

const App = () => {
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
    <div>

      <Header language={language} onLanguageChange={handleLanguageChange} onThemeChange={handleThemeChange} />
      <Dizigner language={language} /> 
      <CommentList language={language} />
    </div>
  );
};

export default App;
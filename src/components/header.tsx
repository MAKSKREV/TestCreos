import React from 'react';
import { Link } from 'react-router-dom';
interface HeaderProps {
  language: 'RU' | 'EN';
  onLanguageChange: (lang: 'RU' | 'EN') => void;
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange, onThemeChange }) => {
  const getWeekNumber = () => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  return (
    <header>
      <div className="header-container">

      <Link to="/designer-table">
          <button className='strancadiz'>{language === 'RU'? 'Страница дизайнера' : 'The designers page'}</button>
      </Link>

        <div className="language-switcher">
          <button onClick={() => onLanguageChange('RU')}>RU</button>
          <button onClick={() => onLanguageChange('EN')}>En</button>
        </div>
        <div className="theme-switcher">
          <button onClick={() => onThemeChange('light')}>Light</button>
          <button onClick={() => onThemeChange('dark')}>Dark</button>
        </div>
        <div className="week-number">
        {language === 'RU'? 'Неделя ' : 'Week '}{getWeekNumber()}
        </div>
        <Link to="/">
          <button className='glav'>{language === 'RU'? 'Главная страница' : 'Main page'}</button>
      </Link>
      <Link to="/zadachi">
          <button className='zadach'>{language === 'RU'? 'Страница задач' : 'The Task page'}</button>
      </Link>
      </div>
    </header>
  );
};

export default Header;

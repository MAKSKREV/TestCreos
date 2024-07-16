// DesignerComponent.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './header';

interface Designer {
  avatar: string;
  username: string;
  email: string;
  thumbnails: {
    avatar: string;
    avatar_2x: string;
    avatar_webp: string;
    avatar_webp_2x: string;
  };
  issues: {
    key: string;
    date_created: string;
    status: string;
  }[];
  medianTimeSpent: number;
  tasksCount: number;
}

interface DesignerComponentProps {
    language: string;
  }

const Dizigner: React.FC<DesignerComponentProps> = ({ language = 'en' }) => {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState(language);

  useEffect(() => {
    axios.get('https://sandbox.creos.me/api/v1/designer/')
      .then(response => {
        const designersWithTasks = response.data.results.map((designer: Designer) => {
          const tasksCount = designer.issues.filter(issue => issue.status === 'Done').length;
          const medianTimeSpent = designer.issues.reduce((acc, issue) => acc + (new Date(issue.date_created).getTime() / 1000), 0) / tasksCount;
          return { ...designer, tasksCount, medianTimeSpent };
        });
        designersWithTasks.sort((a: Designer, b: Designer) => {
          if (a.medianTimeSpent < b.medianTimeSpent) return -1;
          if (a.medianTimeSpent > b.medianTimeSpent) return 1;
          return b.tasksCount - a.tasksCount;
        });
        setDesigners(designersWithTasks.slice(0, 10));
        setLoading(false);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      {loading? (
        <p>Loading...</p>
      ) : (
        <div >
          <h1 className='topcomm'>{language === 'RU'? 'ТОП 10 дизайнеров' : 'TOP 10 designers'}</h1>
          <ul className="designer-list">
            {designers.map((designer: Designer) => (
              <li key={designer.username} className="designer-item">
                <img src={designer.avatar} alt={designer.username} className="avatar" />
                <span className="username">{designer.username}</span>
                <span className="tasks-count">{designer.tasksCount} {language === 'RU'? 'задачи' : 'tasks'}</span>
                <span className="median-time-spent">{designer.medianTimeSpent.toFixed(2)} {language === 'RU'? 'часов' : 'hours'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dizigner;
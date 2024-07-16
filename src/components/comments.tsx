import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Comment {
  id: number;
  issue: string;
  designer: {
    avatar: string;
    username: string;
  };
  date_created: string;
  message: string;
}

interface CommentListProps {
  language: 'RU' | 'EN';
}

const CommentList: React.FC<CommentListProps> = ({ language }) => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    axios.get('https://sandbox.creos.me/api/v1/comment/')
      .then(response => {
        setComments(response.data.slice(0, 10));
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const relativeTime = (date: string, language: 'RU' | 'EN') => {
    const diff = new Date().getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
  
    if (days > 0) {
      return language === 'RU' ? `${days} дней тому назад` : `${days} days ago`;
    } else if (hours > 0) {
      return language === 'RU' ? `${hours} часов тому назад` : `${hours} hours ago`;
    } else {
      return language === 'RU' ? `${minutes} минут тому назад` : `${minutes} minutes ago`;
    }
  };

  return (
    <div className='boxcomm'>
      <h1 className='topcomm'>{language === 'RU' ? 'ТОП 10 комментариев' : 'TOP 10 comments'}</h1>
      <div className="container">
        {comments.map(comment => (
          <div key={comment.id} className="comment">
            <img src={comment.designer.avatar} alt={comment.designer.username} />
            <div className="info">
              <span className="username">{comment.designer.username}</span>
              <span className="relative-time">{relativeTime(comment.date_created, language)}</span>
            </div>
            <div className="issue">{comment.issue}</div>
            <div className="message">{comment.message}</div>
          </div>
        ))}
      </div>
    </div>

  );
};

export default CommentList;
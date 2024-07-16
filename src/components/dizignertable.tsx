import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './tablestyle.css'
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
  issues: Issue[];
}

interface Issue {
  id: number;
  status: string;
  designer: string;
  project: string;
  date_created: string;
  summary: string;
  received_from_client: number;
  send_to_project_manager: number;
  send_to_account_manager: number;
  send_to_designer: number;
  date_updated: string;
  date_started_by_designer: string;
  date_finished_by_designer: string;
  date_finished: string;
}
interface DesignerTableProps {
  language: string;
}
const DesignerTable: React.FC<DesignerTableProps> = ({ language = 'en' }) => {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [paginatedDesigners, setPaginatedDesigners] = useState<Designer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('username');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProject, setFilterProject] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('en');


  useEffect(() => {
    axios.get('https://sandbox.creos.me/api/v1/designer/')
      .then(response => {
        setDesigners(response.data.results);
        setPaginatedDesigners(response.data.results.slice(0, itemsPerPage));
      })
      .catch(error => {
        console.error(error);
      });

    axios.get('https://sandbox.creos.me/api/v1/issue/')
      .then(response => {
        setIssues(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedDesigners(designers.slice(startIndex, endIndex));
  };

  const handleSortChange = (field: string) => {
    setSortField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleFilterStatusChange = (status: string) => {
    setFilterStatus(status);
  };

  const handleFilterProjectChange = (project: string) => {
    setFilterProject(project);
  };

  const filteredDesigners = designers.filter(designer => {
    if (filterStatus) {
      return issues.some(issue => issue.status === filterStatus && issue.designer === designer.username);
    }
    if (filterProject) {
      return issues.some(issue => issue.project === filterProject && issue.designer === designer.username);
    }
    return true;
  });

  const sortedDesigners = filteredDesigners.sort((a, b) => {
    if (sortField === 'username') {
      return sortOrder === 'asc' ? a.username.localeCompare(b.username) : b.username.localeCompare(a.username);
    } else if (sortField === 'email') {
      return sortOrder === 'asc' ? a.email.localeCompare(b.email) : b.email.localeCompare(a.email);
    }
    return 0;
  });

  return (
    <>
    <div className="container">
      <table className="table">
        <thead>
          <tr>
            <th>
              <button onClick={() => handleSortChange('username')}>Username</button>
              {sortField === 'username' && sortOrder === 'asc' ? '' : ''}
            </th>
            <th>
              <button onClick={() => handleSortChange('email')}>Email</button>
              {sortField === 'email' && sortOrder === 'asc' ? '' : ''}
            </th>
            <th> {language === 'RU'? 'Аватар' : 'Avatar'}</th>
            <th>{language === 'RU'? 'Закрытые задачи' : 'Closed Tasks'}</th>
            <th>{language === 'RU'? 'Текущие задачи' : 'In Progress Tasks'}</th>
          </tr>
        </thead>
        <tbody>
          {sortedDesigners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(designer => (
            <tr key={designer.username}>
              <td>{designer.username}</td>
              <td>{designer.email}</td>
              <td><img src={designer.avatar} alt={designer.username} /></td>
              <td>{issues.filter(issue => issue.status === 'Done' && issue.designer === designer.username).length}</td>
              <td>{issues.filter(issue => issue.status === 'In Progress' && issue.designer === designer.username).length}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="filters">
        <label>
        {language === 'RU'? 'Фильтровать по статусу:' : 'Filter by status:'}
          <select value={filterStatus} onChange={e => handleFilterStatusChange(e.target.value)}>
            <option value="">{language === 'RU'? 'Все' : 'All'}</option>
            <option value="Done">{language === 'RU'? 'Сделано' : 'Done'}</option>
            <option value="In Progress">{language === 'RU'? 'в процессе' : 'In Progress'}</option>
          </select>
        </label>
        <label>
        {language === 'RU'? 'Фильтровать по проектам:' : 'Filter by project:'}
          <input type="text" value={filterProject} onChange={e => handleFilterProjectChange(e.target.value)} />
        </label>
      </div>

      <div className="pagination">
        {Array(Math.ceil(sortedDesigners.length / itemsPerPage)).fill(0).map((_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
    </>
  );
};

export default DesignerTable;
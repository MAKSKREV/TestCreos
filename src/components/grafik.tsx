import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Header from './header';

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
  date_started_by_designer: string | null;
  date_finished_by_designer: string | null;
  date_finished: string | null;
}

interface FinancialData {
  week: number;
  income: number;
  expenses: number;
  profit: number;
}

interface FinancialCalculatorProps {
  language: string;
}

const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({ language = 'en' }) => {
  const [financialData, setFinancialData] = useState<FinancialData[]>([]);
  const [numOfWeeks, setNumOfWeeks] = useState(8);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    fetch('https://sandbox.creos.me/api/v1/issue/')
      .then(response => response.json())
      .then((data: Issue[]) => {
        const financialData = data.reduce((acc, issue) => {
          const week = getWeekNumber(issue.date_finished || '');
          const existingWeek = acc.find(item => item.week === week);
          if (existingWeek) {
            existingWeek.income += issue.received_from_client;
            existingWeek.expenses += issue.send_to_project_manager + issue.send_to_account_manager + issue.send_to_designer;
          } else {
            acc.push({
              week,
              income: issue.received_from_client,
              expenses: issue.send_to_project_manager + issue.send_to_account_manager + issue.send_to_designer,
              profit: 0,
            } as FinancialData);
          }
          return acc;
        }, [] as FinancialData[]);
        const updatedFinancialData = financialData.map((item) => {
          const profit = item.income - item.expenses;
          return { ...item, profit };
        });

        setFinancialData(updatedFinancialData.slice(-numOfWeeks));
      });
  }, [numOfWeeks]);

  const getWeekNumber = (date: string) => {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 0; 
    }
    const weekNumber = Math.floor((dateObj.getTime() - new Date(dateObj.getFullYear(), 0, 1).getTime()) / 604800000);
    return weekNumber;
  };

  return (
    <>
    <div className="FinancialCalculator">
      <ul className='weeks'>
  {financialData.map((item, index) => (
    <li key={index}>
      <span>
        {language === 'RU' ? 'День' : 'Week'} {item.week}: 
        {language === 'RU' ? 'Доход' : 'Income'} - {item.income}, 
        {language === 'RU' ? 'Расходы' : 'Expenses'} - {item.expenses}, 
        {language === 'RU' ? 'Прибыль' : 'Profit'} - {item.profit}
      </span>
      <span className="stripe"></span> 
    </li>
  ))}
</ul>


      <p>{language === 'RU' ? '  Количество недель: ' : 'Number of weeks: '}{numOfWeeks}</p>

      <select value={numOfWeeks} onChange={e => setNumOfWeeks(parseInt(e.target.value))}>
        <option value="4">{language === 'RU' ? '4 недели' : '4 weeks'} </option>
    <option value="8">{language === 'RU'? '8 недель' : '8 weeks'}</option>
    <option value="12">{language === 'RU'? '12 недель' : '12 weeks'}</option>
  </select>
</div>
<LineChart width={800} height={400} data={financialData} className="Recharts-wrapper">
        <Line type="monotone" dataKey="income" stroke="#8884d8" className="Recharts-line" />
        <Line type="monotone" dataKey="expenses" stroke="#B00000" className="Recharts-line" />
        <Line type="monotone" dataKey="profit" stroke="#4CAF50" className="Recharts-line" />
        <XAxis dataKey="week" className="Recharts-xaxis" />
        <YAxis className="Recharts-yaxis" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Tooltip wrapperStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: 10 }} />
      </LineChart>
  </>

  );
};

export default FinancialCalculator;
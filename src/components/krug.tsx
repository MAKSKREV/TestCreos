import { useState, useEffect } from 'react';
import { PieChart, Pie, Sector, Cell, Tooltip, Legend } from 'recharts';

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

interface StatusData {
  name: string;
  value: number;
  percentage: number;
}

const StatusPieChart = () => {
  const [statusData, setStatusData] = useState<StatusData[]>([]);

  useEffect(() => {
    fetch('https://sandbox.creos.me/api/v1/issue/')
      .then(response => response.json())
      .then((data: Issue[]) => {
        const totalIssues = data.length;
        const statusData = data.reduce((acc, issue) => {
          const existingStatus = acc.find(item => item.name === issue.status);
          if (existingStatus) {
            existingStatus.value++;
          } else {
            acc.push({ name: issue.status, value: 1, percentage: 0 });
          }
          return acc;
        }, [] as StatusData[]);

        // Calculate percentages
        statusData.forEach(item => {
          item.percentage = Math.round((item.value / totalIssues) * 100);
        });

        setStatusData(statusData);
      });
  }, []);

  return (
    <div className="pie-chart-container">

      <PieChart width={400} height={400}>
        <Pie
          data={statusData}
          cx={200}
          cy={200}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ percentage }) => `${percentage}%`}
        >
          {statusData.map((entry, index) => (
            <Cell key={index} fill={getColor(index)} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

const getColor = (index: number) => {
  const colors = ['#4CAF50', '#FF9800', '#009688', '#2196F3'];
  return colors[index % colors.length];
};

export default StatusPieChart;
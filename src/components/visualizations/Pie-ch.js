import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import "../../css/visualizations/Pie-ch.css"; 

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const DonutGraph = () => {
  const data = {
    labels: ['Electronics', 'Groceries', 'Clothing', 'Books', 'Other'],
    datasets: [
      {
        label: 'Expenditure (%)',
        data: [30, 25, 20, 15, 10], // Example percentages
        backgroundColor: [
          'rgba(75, 192, 192, 0.7)', // Green
          'rgba(255, 206, 86, 0.7)', // Yellow
          'rgba(54, 162, 235, 0.7)', // Blue
          'rgba(153, 102, 255, 0.7)', // Purple
          'rgba(255, 99, 132, 0.7)', // Red
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom', // Legend position
      },
    },
  };

  return (
    <div className="donut-graph-container">
      <h2>Category</h2>
    
      <div className="pie-wrapper">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default DonutGraph;

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import "../../css/visualizations/Bar-ch.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarGraph = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Sales ($)',
        data: [5000, 8000, 4000, 7000, 6000],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)', // Red
          'rgba(54, 162, 235, 0.5)', // Blue
          'rgba(255, 206, 86, 0.5)', // Yellow
          'rgba(75, 192, 192, 0.5)', // Green
          'rgba(153, 102, 255, 0.5)' // Purple
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
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
        position: 'top',
      },
    },
    scales: {
      x: {
        // Adjust spacing between bars
        barPercentage: 0.9,  // Increase for larger bars, decrease for more space between bars
        categoryPercentage: 1.0, // Set to 1 to take full width per label
      },
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false, // Ensures the chart adapts to the container's width and height
  };

  return (
    <div className="bar-graph-container">
      <h2>Monthly Disaster</h2>
      <div className="bar-wrapper">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarGraph;

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EnvironmentScoreChart = ({ environments, height = 300 }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `Pontuação: ${context.raw.toFixed(1)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: { stepSize: 1 },
        title: { display: true, text: 'Média de Pontuação' },
      },
      x: {
        title: { display: true, text: 'Ambientes' },
      },
    },
  };

  const data = {
    labels: environments.map(env => env.name),
    datasets: [{
      label: 'Pontuação Média',
      data: environments.map(env => env.score),
      backgroundColor: environments.map(env => {
        if (env.score >= 4) return 'rgba(0, 166, 81, 0.7)';
        if (env.score >= 3) return 'rgba(255, 130, 0, 0.7)';
        return 'rgba(239, 68, 68, 0.7)';
      }),
      borderColor: environments.map(env => {
        if (env.score >= 4) return 'rgba(0, 166, 81, 1)';
        if (env.score >= 3) return 'rgba(255, 130, 0, 1)';
        return 'rgba(239, 68, 68, 1)';
      }),
      borderWidth: 1,
    }],
  };

  return (
    <div style={{ height }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export default EnvironmentScoreChart;

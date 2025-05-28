import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Exemplo de nomes e cores (substitua conforme necessário)
const pillarNames = {
  limpeza: 'Limpeza',
  organização: 'Organização',
  saúde: 'Saúde',
  padronização: 'Padronização',
  disciplina: 'Disciplina',
};

const pillarColors = {
  limpeza: '#36A2EB',
  organização: '#FFCE56',
  saúde: '#FF6384',
  padronização: '#4BC0C0',
  disciplina: '#9966FF',
};

const PillarChart = ({ scores, height = 300, width = '100%' }) => {
  const data = {
    labels: scores.map(score => pillarNames[score.pillar]),
    datasets: [{
      label: 'Pontuação',
      data: scores.map(score => score.score),
      backgroundColor: 'rgba(0, 86, 164, 0.2)',
      borderColor: 'rgba(0, 86, 164, 1)',
      borderWidth: 2,
      pointBackgroundColor: scores.map(score => pillarColors[score.pillar]),
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0, 86, 164, 1)',
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
          callback: (value) => value.toString(),
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const pillar = scores[index].pillar;
            return `${pillarNames[pillar]}: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height, width }}>
      <Radar data={data} options={options} />
    </div>
  );
};

export default PillarChart;

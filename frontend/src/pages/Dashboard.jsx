import React, { useMemo, useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Calendar, Clipboard } from 'lucide-react';
import Card from '../components/common/Card';
import PillarChart from '../components/charts/PillarChart';
import EnvironmentScoreChart from '../components/charts/EnvironmentScoreChart';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEnvironments: 0,
    totalEvaluations: 0,
    recentEvaluations: 0,
    averageScore: 0,
    environmentScores: [],
    pillarScores: [],
    latestEnvironment: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const envRes = await axios.get('http://localhost:5000/api/environments/', { headers });
        const environments = envRes.data;

        const mockEvaluations = environments.map((env, i) => ({
          id: `${env.id}-eval`,
          environmentId: env.id,
          averageScore: Math.random() * 5,
          date: new Date(Date.now() - i * 86400000).toISOString()
        }));

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentEvaluations = mockEvaluations.filter(
          evaluation => new Date(evaluation.date) >= thirtyDaysAgo
        );

        const environmentScores = environments.map(env => {
          const envEvaluations = mockEvaluations.filter(e => e.environmentId === env.id);
          let score = 0;
          if (envEvaluations.length > 0) {
            score = envEvaluations.reduce((sum, e) => sum + (e.averageScore || 0), 0) / envEvaluations.length;
          }
          return {
            id: env.id,
            name: env.name,
            score,
          };
        }).sort((a, b) => b.score - a.score);

        const latestEvaluation = mockEvaluations.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];

        const pillarScores = latestEvaluation
          ? [
              { pillar: 'Utilização', score: Math.random() * 5 },
              { pillar: 'Organização', score: Math.random() * 5 },
              { pillar: 'Limpeza', score: Math.random() * 5 },
              { pillar: 'Padronização', score: Math.random() * 5 },
              { pillar: 'Disciplina', score: Math.random() * 5 },
            ]
          : [];

        setStats({
          totalEnvironments: environments.length,
          totalEvaluations: mockEvaluations.length,
          recentEvaluations: recentEvaluations.length,
          averageScore: mockEvaluations.reduce((sum, e) => sum + (e.averageScore || 0), 0) / mockEvaluations.length,
          environmentScores,
          pillarScores,
          latestEnvironment: latestEvaluation
            ? environments.find(env => env.id === latestEvaluation.environmentId)?.name
            : null,
        });
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="page-title mb-2 sm:mb-0">Dashboard</h1>
        {user?.role !== 'student' && (
          <div className="flex space-x-3">
            <Link to="/evaluations/new">
              <Button variant="primary" leftIcon={<Clipboard className="h-4 w-4" />}>Nova Avaliação</Button>
            </Link>
            <Link to="/calendar">
              <Button variant="outline" leftIcon={<Calendar className="h-4 w-4" />}>Agendar Vistoria</Button>
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Média Geral</h3>
            <div className="flex items-center text-success-500">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span className="text-xs">2%</span>
            </div>
          </div>
          <div className="flex items-end">
            <span className="text-3xl font-bold">{stats.averageScore.toFixed(1)}</span>
            <span className="text-lg text-gray-500 ml-1">/5</span>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total de Avaliações</h3>
            <div className="flex items-center text-success-500">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span className="text-xs">5%</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-3xl font-bold">{stats.totalEvaluations}</span>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Avaliações Recentes</h3>
            <div className="flex items-center text-error-500">
              <ArrowDown className="h-4 w-4 mr-1" />
              <span className="text-xs">3%</span>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-3xl font-bold">{stats.recentEvaluations}</span>
            <span className="text-sm text-gray-500 ml-2">/ último mês</span>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Ambientes</h3>
          </div>
          <div className="flex items-center">
            <span className="text-3xl font-bold">{stats.totalEnvironments}</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card title="Última Avaliação por Pilar" className="lg:col-span-1">
          {stats.latestEnvironment && (
            <div className="mb-3 text-sm text-gray-500">
              Ambiente: <span className="font-medium text-gray-700">{stats.latestEnvironment}</span>
            </div>
          )}

          {stats.pillarScores.length > 0 ? (
            <PillarChart scores={stats.pillarScores} height={280} />
          ) : (
            <div className="h-60 flex items-center justify-center text-gray-500">
              Nenhuma avaliação encontrada
            </div>
          )}
        </Card>

        <Card title="Pontuação por Ambiente" className="lg:col-span-2">
          <div className="mb-4 text-sm text-gray-500">
            Comparativo de notas médias entre os ambientes avaliados
          </div>

          {stats.environmentScores.length > 0 ? (
            <EnvironmentScoreChart environments={stats.environmentScores.slice(0, 6)} height={260} />
          ) : (
            <div className="h-60 flex items-center justify-center text-gray-500">
              Nenhum ambiente avaliado
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

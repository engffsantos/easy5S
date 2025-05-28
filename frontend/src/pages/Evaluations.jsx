import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download, Eye, Calendar, ChevronDown, Clock, MapPin, User } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import axios from 'axios';
import PillarChart from '../components/charts/PillarChart';

const Evaluations = () => {
  const [user, setUser] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [inspectors, setInspectors] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnvironment, setSelectedEnvironment] = useState('all');
  const [selectedInspector, setSelectedInspector] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [expandedEvaluation, setExpandedEvaluation] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    setUser(currentUser);

    const fetchData = async () => {
      try {
        const [evalRes, envRes, userRes, qstRes] = await Promise.all([
          axios.get('http://localhost:5000/api/evaluations', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/environments', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/questions', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        setEvaluations(evalRes.data);
        setEnvironments(envRes.data);
        setInspectors(userRes.data.filter(u => u.role === 'inspector'));
        setQuestions(qstRes.data);
      } catch (err) {
        console.error('Erro ao carregar avaliações:', err);
      }
    };

    fetchData();
  }, [token]);

  const getScoreColor = (score) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredEvaluations = evaluations.filter(evaluation => {
    const environment = environments.find(env => env.id === evaluation.environmentId);
    const inspector = inspectors.find(ins => ins.id === evaluation.inspectorId);

    const matchesSearch = environment?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspector?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEnvironment = selectedEnvironment === 'all' || evaluation.environmentId === selectedEnvironment;
    const matchesInspector = selectedInspector === 'all' || evaluation.inspectorId === selectedInspector;
    const matchesDate = (!dateRange.start || evaluation.date >= dateRange.start) &&
      (!dateRange.end || evaluation.date <= dateRange.end);

    return matchesSearch && matchesEnvironment && matchesInspector && matchesDate;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const toggleExpand = (id) => {
    setExpandedEvaluation(expandedEvaluation === id ? null : id);
  };

  const calculateAverageScores = (evaluation) => {
    const scores = evaluation.answers.map(a => a.score).filter(s => s !== null && s !== undefined);
    return scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  };

  const groupByPillar = (answers) => {
    const scores = {};
    const counts = {};
    answers.forEach(a => {
      const question = questions.find(q => q.id === a.questionId);
      if (!question) return;
      if (!scores[question.pillar]) {
        scores[question.pillar] = 0;
        counts[question.pillar] = 0;
      }
      scores[question.pillar] += a.score;
      counts[question.pillar]++;
    });
    const result = {};
    Object.keys(scores).forEach(pillar => {
      result[pillar] = parseFloat((scores[pillar] / counts[pillar]).toFixed(2));
    });
    return result;
  };

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="page-title mb-2">Avaliações</h1>
          <p className="text-gray-600">
            {filteredEvaluations.length} {filteredEvaluations.length === 1 ? 'avaliação encontrada' : 'avaliações encontradas'}
          </p>
        </div>

        {user?.role !== 'student' && (
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Link to="/evaluations/new">
              <Button variant="primary">Nova Avaliação</Button>
            </Link>
            <Link to="/calendar">
              <Button variant="outline" leftIcon={<Calendar className="h-4 w-4" />}>Ver Calendário</Button>
            </Link>
          </div>
        )}
      </div>

      <Card className="mb-6">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="form-label">Buscar</label>
            <input type="text" className="form-input" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar avaliações..." />
          </div>
          <div>
            <label className="form-label">Ambiente</label>
            <select className="form-select" value={selectedEnvironment} onChange={e => setSelectedEnvironment(e.target.value)}>
              <option value="all">Todos os ambientes</option>
              {environments.map(env => (<option key={env.id} value={env.id}>{env.name}</option>))}
            </select>
          </div>
          <div>
            <label className="form-label">Avaliador</label>
            <select className="form-select" value={selectedInspector} onChange={e => setSelectedInspector(e.target.value)}>
              <option value="all">Todos os avaliadores</option>
              {inspectors.map(ins => (<option key={ins.id} value={ins.id}>{ins.name}</option>))}
            </select>
          </div>
          <div>
            <label className="form-label">Período</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" className="form-input" value={dateRange.start} onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))} />
              <input type="date" className="form-input" value={dateRange.end} onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))} />
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredEvaluations.map(evaluation => {
          const environment = environments.find(env => env.id === evaluation.environmentId);
          const inspector = inspectors.find(ins => ins.id === evaluation.inspectorId);
          const isExpanded = expandedEvaluation === evaluation.id;
          const avgScore = calculateAverageScores(evaluation);
          const pillarScores = groupByPillar(evaluation.answers);

          return (
            <Card key={evaluation.id} className={`transition-all duration-300 ${isExpanded ? 'shadow-elevated' : 'hover:shadow-elevated'}`}>
              <div className="flex flex-col md:flex-row md:items-center cursor-pointer" onClick={() => toggleExpand(evaluation.id)}>
                <div className="flex-1">
                  <div className="flex items-start md:items-center flex-col md:flex-row md:space-x-4">
                    <div className="flex items-center space-x-2 mb-2 md:mb-0">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <h3 className="text-lg font-semibold">{environment?.name}</h3>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center"><User className="h-4 w-4 mr-1" />{inspector?.name}</div>
                      <div className="flex items-center"><Clock className="h-4 w-4 mr-1" />{new Date(evaluation.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                  <div className="flex items-baseline mr-6">
                    <span className={`text-2xl font-bold ${getScoreColor(avgScore)}`}>{avgScore.toFixed(1)}</span>
                    <span className="text-gray-400 ml-1">/5</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>
              {isExpanded && (
                <div className="mt-6 pt-6 border-t animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-4">Pontuação por Pilar</h4>
                      <PillarChart scores={pillarScores} height={250} />
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-4">Observações</h4>
                        <div className="space-y-4">
                          {evaluation.answers.filter(a => a.observation).map(a => {
                            const question = questions.find(q => q.id === a.questionId);
                            return (
                              <div key={a.questionId} className="bg-gray-50 rounded-lg p-4">
                                <p className="font-medium text-sm mb-2">{question?.text}</p>
                                <p className="text-gray-600 text-sm">{a.observation}</p>
                                <div className="flex items-center mt-2">
                                  <div className={`text-sm font-medium ${getScoreColor(a.score)}`}>Nota: {a.score}/5</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <Button variant="outline" size="sm" leftIcon={<Eye className="h-4 w-4" />}>Ver Detalhes</Button>
                        <Button variant="outline" size="sm" leftIcon={<Download className="h-4 w-4" />}>Exportar PDF</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Evaluations;

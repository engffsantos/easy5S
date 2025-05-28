import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import axios from 'axios';

const EvaluationForm = () => {
  const navigate = useNavigate();
  const [environments, setEnvironments] = useState([]);
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const envRes = await axios.get('http://localhost:5000/api/environments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEnvironments(envRes.data);

        const qstRes = await axios.get('http://localhost:5000/api/questions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestions(qstRes.data);
      } catch (err) {
        console.error('Erro ao carregar dados iniciais:', err);
      }
    };
    fetchInitialData();
  }, [token]);

  const handleAnswerChange = (questionId, score, observation = '') => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => a.questionId === questionId ? { ...a, score, observation } : a);
      }
      return [...prev, { questionId, score, observation }];
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/evaluations', {
        environmentId: selectedEnvironmentId,
        inspectorId: user.id,
        date: new Date().toISOString().split('T')[0],
        answers,
        status: 'completed'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/evaluations');
    } catch (err) {
      console.error('Erro ao enviar avaliação:', err);
    }
  };

  return (
    <div className="page-container max-w-3xl mx-auto">
      <h1 className="page-title">Nova Avaliação</h1>

      <div className="my-4">
        <label className="form-label">Ambiente</label>
        <select
          className="form-select"
          value={selectedEnvironmentId}
          onChange={e => setSelectedEnvironmentId(e.target.value)}
        >
          <option value="">Selecione um ambiente</option>
          {environments.map(env => (
            <option key={env.id} value={env.id}>{env.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {questions.map(q => (
          <Card key={q.id}>
            <div className="mb-2 font-semibold">{q.text}</div>
            <div className="mb-2">
              {[0,1,2,3,4,5].map(score => (
                <button
                  key={score}
                  onClick={() => handleAnswerChange(q.id, score)}
                  className="mr-2 w-8 h-8 rounded-full bg-gray-200 hover:bg-blue-500 hover:text-white"
                >{score}</button>
              ))}
            </div>
            <textarea
              className="form-input w-full"
              placeholder="Observações"
              onChange={(e) => handleAnswerChange(q.id, null, e.target.value)}
            />
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Button onClick={handleSubmit} leftIcon={<Save className="w-4 h-4" />}>
          Enviar Avaliação
        </Button>
      </div>
    </div>
  );
};

export default EvaluationForm;

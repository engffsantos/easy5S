import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../components/common/Button';

const CorrectiveActions = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [actions, setActions] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const jwt = localStorage.getItem('token');
    setUser(currentUser);
    setToken(jwt);

    const fetchActions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/actions', {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        setActions(response.data);
      } catch (error) {
        console.error('Erro ao buscar ações corretivas:', error);
      }
    };

    fetchActions();
  }, []);

  const handleSubmit = async (actionId, observation, image) => {
    try {
      const formData = new FormData();
      formData.append('observation', observation);
      if (image) formData.append('image', image);

      await axios.post(
        `http://localhost:5000/api/actions/${actionId}/respond`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('Ação respondida com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar resposta da ação:', error);
      alert('Erro ao enviar resposta da ação.');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title mb-6">Ações Corretivas</h1>

      {actions.map((action) => (
        <div key={action.id} className="border rounded-lg p-4 mb-4 shadow-sm bg-white">
          <h2 className="font-semibold text-lg">{action.environment.name}</h2>
          <p><strong>Responsável:</strong> {action.responsible.name}</p>
          <p><strong>Status:</strong> {action.status}</p>
          <p><strong>Prazo:</strong> {action.deadline}</p>
          <p><strong>Observação original:</strong> {action.originalObservation}</p>

          {action.status === 'pendente' && user?.id === action.responsible.id && (
            <form
              className="mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                const observation = e.target.observation.value;
                const image = e.target.image.files[0];
                handleSubmit(action.id, observation, image);
              }}
            >
              <div className="mb-2">
                <label htmlFor="observation" className="form-label">Observação</label>
                <textarea id="observation" name="observation" className="form-textarea w-full" required />
              </div>
              <div className="mb-2">
                <label htmlFor="image" className="form-label">Foto (opcional)</label>
                <input type="file" id="image" name="image" className="form-input" accept="image/*" />
              </div>
              <Button type="submit" variant="primary">Enviar Resposta</Button>
            </form>
          )}
        </div>
      ))}

      {actions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Nenhuma ação corretiva disponível.
        </div>
      )}
    </div>
  );
};

export default CorrectiveActions;

import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { mockUsers, mockEnvironments } from '../../mockData';

const NewEvaluationModal = ({ isOpen, onClose, onSubmit }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    environmentId: '',
    inspectorId: user?.role === 'inspector' ? user.id : '',
    scheduledDate: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      environmentId: '',
      inspectorId: user?.role === 'inspector' ? user.id : '',
      scheduledDate: '',
    });
  };

  const today = new Date().toISOString().split('T')[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg z-50 relative p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Agendar Nova Vistoria</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="environment" className="form-label">Ambiente</label>
              <select
                id="environment"
                className="form-select"
                value={formData.environmentId}
                onChange={(e) => setFormData({ ...formData, environmentId: e.target.value })}
                required
              >
                <option value="">Selecione um ambiente...</option>
                {mockEnvironments
                  .filter(env => env.isActive)
                  .map(env => (
                    <option key={env.id} value={env.id}>
                      {env.name} (Bloco {env.block})
                    </option>
                  ))}
              </select>
            </div>

            {user?.role === 'manager' && (
              <div>
                <label htmlFor="inspector" className="form-label">Inspetor</label>
                <select
                  id="inspector"
                  className="form-select"
                  value={formData.inspectorId}
                  onChange={(e) => setFormData({ ...formData, inspectorId: e.target.value })}
                  required
                >
                  <option value="">Selecione um inspetor...</option>
                  {mockUsers
                    .filter(u => u.role === 'inspector')
                    .map(inspector => (
                      <option key={inspector.id} value={inspector.id}>
                        {inspector.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="date" className="form-label">Data da Vistoria</label>
              <input
                type="date"
                id="date"
                className="form-input"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                min={today}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button variant="primary" type="submit" leftIcon={<Calendar className="h-4 w-4" />}>
                Agendar Vistoria
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewEvaluationModal;

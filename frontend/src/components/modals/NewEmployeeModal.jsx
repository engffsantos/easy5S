import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';

const NewEmployeeModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'responsible',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ fullName: '', email: '', role: 'responsible' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md z-50 relative p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Novo Funcionário</h2>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Nome Completo</label>
              <input
                className="form-input"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label">Função</label>
              <select
                className="form-select"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="responsible">Responsável</option>
                <option value="inspector">Inspetor</option>
                <option value="manager">Gerente</option>
                <option value="student">Aluno</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" variant="primary">Criar</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewEmployeeModal;

import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import Button from '../common/Button';
import NewEmployeeModal from './NewEmployeeModal';

const environmentTypes = {
  classroom: 'Sala de Aula',
  laboratory: 'Laboratório',
  office: 'Escritório',
  workshop: 'Oficina',
  other: 'Outro',
};

const NewEnvironmentModal = ({ isOpen, onClose, onSubmit, employees = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'classroom',
    block: '',
    description: '',
    responsibleIds: [],
  });

  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      type: 'classroom',
      block: '',
      description: '',
      responsibleIds: [],
    });
  };

  const handleNewEmployee = (employee) => {
    console.log('Novo funcionário criado:', employee);
    setIsNewEmployeeModalOpen(false);
  };

  const toggleResponsible = (employeeId) => {
    setFormData((prev) => ({
      ...prev,
      responsibleIds: prev.responsibleIds.includes(employeeId)
        ? prev.responsibleIds.filter((id) => id !== employeeId)
        : [...prev.responsibleIds, employeeId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg z-50 relative p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Novo Ambiente</h3>
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Nome do Ambiente</label>
              <input
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label">Tipo</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {Object.entries(environmentTypes).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label">Bloco</label>
              <input
                className="form-input"
                value={formData.block}
                onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="form-label">Descrição</label>
              <textarea
                className="form-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="form-label">Responsáveis</label>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<UserPlus className="w-4 h-4" />}
                  onClick={() => setIsNewEmployeeModalOpen(true)}
                >
                  Novo Funcionário
                </Button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-2">
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                      formData.responsibleIds.includes(employee.id)
                        ? 'bg-primary-50 border border-primary-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                    onClick={() => toggleResponsible(employee.id)}
                  >
                    <div>
                      <div className="font-medium">{employee.fullName}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        formData.responsibleIds.includes(employee.id)
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}
                    >
                      {formData.responsibleIds.includes(employee.id) && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {formData.responsibleIds.length === 0 && (
                <p className="text-sm text-red-500 mt-1">Selecione pelo menos um responsável</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" variant="primary" disabled={formData.responsibleIds.length === 0}>
                Criar Ambiente
              </Button>
            </div>
          </form>
        </div>
      </div>

      <NewEmployeeModal
        isOpen={isNewEmployeeModalOpen}
        onClose={() => setIsNewEmployeeModalOpen(false)}
        onSubmit={handleNewEmployee}
      />
    </div>
  );
};

export default NewEnvironmentModal;

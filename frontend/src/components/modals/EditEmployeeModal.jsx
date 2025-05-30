import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';

const EditEmployeeModal = ({ isOpen, onClose, onSubmit, employee }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'responsible',
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        fullName: employee.fullName || '',
        email: employee.email || '',
        password: '',
        confirmPassword: '',
        role: employee.role || 'responsible',
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'responsible',
      });
    }
  }, [employee]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!employee && formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem.');
      return;
    }

    const payload = {
      id: employee?.id,
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
    };

    if (!employee) {
      payload.password = formData.password;
    }

    onSubmit(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {employee ? 'Editar Funcionário' : 'Novo Funcionário'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="form-label">Nome Completo</label>
                  <input
                    type="text"
                    id="fullName"
                    className="form-input"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                {!employee && (
                  <>
                    <div>
                      <label htmlFor="password" className="form-label">Senha</label>
                      <input
                        type="password"
                        id="password"
                        className="form-input"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="form-label">Confirmar Senha</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="form-input"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="role" className="form-label">Função</label>
                  <select
                    id="role"
                    className="form-select"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  >
                    <option value="responsible">Responsável</option>
                    <option value="inspector">Inspetor</option>
                    <option value="manager">Gerente</option>
                    <option value="student">Aluno</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>Cancelar</Button>
                <Button variant="primary" type="submit">
                  {employee ? 'Salvar Alterações' : 'Criar Funcionário'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeModal;

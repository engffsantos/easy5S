import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Mail, UserCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import EditEmployeeModal from '../components/modals/EditEmployeeModal';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Employees = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [employeeEnvs, setEmployeeEnvs] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEnvironment, setSelectedEnvironment] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [empRes, envRes, empEnvRes] = await Promise.all([
        axios.get('http://localhost:5000/api/employees/', config),
        axios.get('http://localhost:5000/api/environments/', config),
        axios.get('http://localhost:5000/api/environment_employees/', config)
      ]);

      setEmployees(empRes.data);
      setEnvironments(envRes.data);
      setEmployeeEnvs(empEnvRes.data);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      (emp.fullName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (emp.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesEnv = selectedEnvironment === 'all' ||
      employeeEnvs.some(ee => ee.employeeId === emp.id && ee.environmentId === selectedEnvironment);

    return matchesSearch && matchesEnv;
  });

  const handleEditEmployee = (employee = null) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`http://localhost:5000/api/employees/${id}`, config);
      fetchData();
    } catch (err) {
      console.error('Erro ao excluir funcionário:', err);
    }
  };

  const handleSubmitEmployee = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (data.id) {
        await axios.put(`http://localhost:5000/api/employees/${data.id}`, data, config);
      } else {
        await axios.post('http://localhost:5000/api/employees/', data, config);
      }

      console.log('Funcionário salvo:', data);
      setIsEditModalOpen(false);
      setEditingEmployee(null);
      fetchData();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error.response?.data || error.message);
    }
  };

  const getRoleLabel = (role) => {
    const roles = {
      manager: 'Gerente',
      inspector: 'Inspetor',
      student: 'Aluno',
      responsible: 'Responsável',
    };
    return roles[role] || role;
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      manager: 'bg-primary-100 text-primary-800',
      inspector: 'bg-secondary-100 text-secondary-800',
      student: 'bg-accent-100 text-accent-800',
      responsible: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="page-title mb-2">Funcionários</h1>
          <p className="text-gray-600">
            {filteredEmployees.length} {filteredEmployees.length === 1 ? 'funcionário encontrado' : 'funcionários encontrados'}
          </p>
        </div>

        {user?.role === 'manager' && (
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => handleEditEmployee()}
          >
            Novo Funcionário
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="form-label">Buscar</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="form-input pl-10"
                placeholder="Buscar funcionários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label htmlFor="environment" className="form-label">Ambiente</label>
            <select
              id="environment"
              className="form-select"
              value={selectedEnvironment}
              onChange={(e) => setSelectedEnvironment(e.target.value)}
            >
              <option value="all">Todos os ambientes</option>
              {environments.map(env => (
                <option key={env.id} value={env.id}>{env.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((emp) => {
          const envs = employeeEnvs
            .filter(ee => ee.employeeId === emp.id)
            .map(ee => environments.find(env => env.id === ee.environmentId))
            .filter(Boolean);

          return (
            <Card key={emp.id} className="hover:shadow-elevated transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <UserCircle className="h-10 w-10 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{emp.fullName}</h3>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <Mail className="h-4 w-4 mr-1" />
                      {emp.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(emp.role)}`}>
                  {getRoleLabel(emp.role)}
                </span>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Ambientes Responsável:</h4>
                <div className="flex flex-wrap gap-2">
                  {envs.length > 0 ? envs.map(env => (
                    <span key={env.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {env.name}
                    </span>
                  )) : (
                    <span className="text-sm text-gray-500">Nenhum ambiente associado</span>
                  )}
                </div>
              </div>

              {user?.role === 'manager' && (
                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Edit className="h-4 w-4" />}
                    onClick={() => handleEditEmployee(emp)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    leftIcon={<Trash2 className="h-4 w-4" />}
                    onClick={() => handleDeleteEmployee(emp.id)}
                  >
                    Excluir
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum funcionário encontrado</p>
        </div>
      )}

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleSubmitEmployee}
        employee={editingEmployee}
      />
    </div>
  );
};

export default Employees;

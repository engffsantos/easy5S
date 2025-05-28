import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import { pillarNames } from '../../utils/constants'; // você deve mover os dados mock para este caminho ou atualizar conforme seu projeto

const ManageQuestionsModal = ({ isOpen, onClose, onSave, existingQuestions }) => {
  const [questions, setQuestions] = useState(existingQuestions || []);
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    pillar: 'seiri',
    scope: 'general',
  });

  const handleAddQuestion = () => {
    if (!newQuestion.text.trim()) return;

    const question = {
      id: crypto.randomUUID(),
      text: newQuestion.text,
      pillar: newQuestion.pillar,
      scope: newQuestion.scope,
    };

    setQuestions([...questions, question]);
    setNewQuestion({ text: '', pillar: 'seiri', scope: 'general' });
  };

  const handleRemoveQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSave = () => {
    onSave(questions);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Gerenciar Questões</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Adicionar Nova Questão</h4>
              <div className="space-y-4">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Digite a questão..."
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Pilar</label>
                    <select
                      className="form-select"
                      value={newQuestion.pillar}
                      onChange={(e) => setNewQuestion({ ...newQuestion, pillar: e.target.value })}
                    >
                      {Object.entries(pillarNames).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Escopo</label>
                    <select
                      className="form-select"
                      value={newQuestion.scope}
                      onChange={(e) => setNewQuestion({ ...newQuestion, scope: e.target.value })}
                    >
                      <option value="general">Geral</option>
                      <option value="type">Tipo de Ambiente</option>
                      <option value="block">Bloco</option>
                      <option value="environment">Ambiente Específico</option>
                    </select>
                  </div>
                </div>

                <Button variant="outline" fullWidth onClick={handleAddQuestion} leftIcon={<Plus className="h-4 w-4" />}>
                  Adicionar Questão
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Questões Existentes</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {questions.map((question) => (
                  <div key={question.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 mr-4">
                      <p className="text-sm font-medium">{question.text}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                          {pillarNames[question.pillar]}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {question.scope}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveQuestion(question.id)} className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button variant="primary" onClick={handleSave}>Salvar Alterações</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageQuestionsModal;

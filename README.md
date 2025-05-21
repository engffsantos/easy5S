
# 📋 Sistema de Avaliação 5S - SENAI Birigui

## ✨ Visão Geral
O Sistema de Avaliação 5S é uma solução digital desenvolvida para modernizar e otimizar o processo de avaliação dos ambientes escolares do SENAI Birigui. A plataforma centraliza todas as etapas do processo 5S, desde o agendamento de vistorias até a geração de relatórios analíticos, promovendo uma cultura de melhoria contínua.

---

## 🚀 Funcionalidades Principais

### 👤 Gestão de Usuários e Permissões
- **Perfis hierárquicos**:
  - **Administradores**: Acesso completo ao sistema, gestão de usuários e configurações
  - **Gestores**: Cadastro de ambientes, agendamento de vistorias, análise de indicadores
  - **Inspetores**: Realização de avaliações 5S com checklist digital
  - **Alunos** (opcional): Consulta de resultados e relatórios (acesso limitado)

### 🏢 Gestão de Ambientes
- Cadastro completo de ambientes com:
  - Dados básicos (nome, tipo, bloco)
  - Metadados (dimensões, capacidade, responsável)
  - Status (ativo/inativo/manutenção)
  - Fotos e documentos anexados

### 📝 Sistema de Avaliação
- **Checklist dinâmico** adaptável a cada tipo de ambiente
- Avaliação por pilares 5S (Seiri, Seiton, Seisō, Seiketsu, Shitsuke)
- Pontuação de 0-5 com critérios claros
- Registro de:
  - Observações detalhadas
  - Evidências fotográficas
  - Pontos de atenção críticos

### 📊 Painéis de Controle
- **Dashboards interativos** com:
  - Visão geral por bloco/tipo de ambiente
  - Evolução histórica dos indicadores
  - Comparativo entre períodos
  - Mapa de calor de conformidade
- **Relatórios inteligentes**:
  - PDF gerado automaticamente
  - Gráficos e análises contextualizadas
  - Planilhas exportáveis para Excel

### 🗓️ Gestão de Vistorias
- Calendário integrado com:
  - Agendamento recorrente
  - Alocação de inspetores
  - Notificações automáticas
  - Histórico completo de avaliações

---

## 🛠️ Arquitetura Técnica

### Backend (API RESTful)
- **Linguagem**: Python 3.11+
- **Framework**: Flask
- **Bibliotecas principais**:
  - Flask-SQLAlchemy (ORM)
  - Flask-Migrate (migrations)
  - Flask-JWT-Extended (autenticação)
  - WeasyPrint (geração de PDF)
  - Pillow (processamento de imagens)

### Frontend Web
- **Tecnologias**:
  - React.js 18+
  - TypeScript
  - React Query (gestão de estado)
  - Material-UI (componentes)
  - Chart.js (visualização de dados)
  - FullCalendar (agendamento)

### Infraestrutura
- **Banco de Dados**:
  - PostgreSQL (produção)
  - SQLite (desenvolvimento)
- **Armazenamento**:
  - Firebase Storage (imagens e documentos)
- **Hospedagem**:
  - Render (backend)
  - Vercel (frontend)

### DevOps
- Docker (containerização)
- GitHub Actions (CI/CD)
- Sentry (monitoramento de erros)

---

## 📂 Estrutura do Projeto

```
sistema-5s/
├── backend/
│   ├── app/
│   │   ├── models/          # Modelos de dados
│   │   ├── controllers/     # Lógica de negócio
│   │   ├── services/        # Serviços externos
│   │   ├── utils/           # Utilitários
│   │   ├── static/          # Arquivos estáticos
│   │   └── templates/       # Templates de e-mail/PDF
│   ├── migrations/          # Migrações de banco
│   ├── tests/               # Testes automatizados
│   ├── config.py            # Configurações
│   └── app.py               # Ponto de entrada
│
└── frontend/
    ├── public/              # Assets públicos
    ├── src/
    │   ├── components/      # Componentes reutilizáveis
    │   ├── contexts/        # Contextos globais
    │   ├── hooks/           # Custom hooks
    │   ├── pages/           # Páginas da aplicação
    │   ├── services/        # Chamadas à API
    │   ├── styles/          # Estilos globais
    │   ├── types/           # Tipos TypeScript
    │   ├── utils/           # Utilitários
    │   ├── App.tsx          # Componente principal
    │   └── main.tsx         # Ponto de entrada
    └── vite.config.ts       # Configuração do Vite
```

---

## 🧩 Modelo de Dados (Diagrama Conceitual)

```
[Usuário] 1---* [Avaliação]
    |           |
    |           v
    |       [Resposta] *---1 [Pergunta]
    |
    v
[Agendamento] *---1 [Ambiente]
                    |
                    v
                [Tipo Ambiente]
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Git

### Configuração do Ambiente

1. **Backend**:
```bash
git clone https://github.com/seu-repositorio/sistema-5s.git
cd sistema-5s/backend

# Configurar ambiente virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente
cp .env.example .env
# Editar o .env com suas configurações

# Executar migrações
flask db upgrade

# Iniciar servidor
flask run --port 5000
```

2. **Frontend**:
```bash
cd ../frontend

# Instalar dependências
npm install

# Configurar variáveis
cp .env.example .env.local
# Editar o .env.local com suas configurações

# Iniciar aplicação
npm run dev
```

Acesse: http://localhost:3000

---

## 📌 Roadmap de Desenvolvimento

### Versão 1.0 (Atual)
- Módulo básico de avaliações
- Gestão de ambientes e usuários
- Relatórios em PDF

### Versão 2.0 (Previsto)
- [ ] Aplicativo mobile (React Native)
- [ ] Integração com Microsoft 365
- [ ] Módulo de ações corretivas
- [ ] API para integração com outros sistemas

### Futuro
- [ ] Painel de benchmark entre unidades
- [ ] Machine Learning para sugestões automáticas
- [ ] IoT (sensores de ambiente)

---

## 🤝 Como Contribuir
1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/incrivel`)
3. Commit suas mudanças (`git commit -m 'Adiciona feature incrível'`)
4. Push para a branch (`git push origin feature/incrivel`)
5. Abra um Pull Request

---

## 📄 Licença
Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍💻 Desenvolvido por 
**EasyData360**  
[![Website](https://img.shields.io/badge/-Website-blue)](https://www.easydata360.com.br)  
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0077B5)](https://www.linkedin.com/company/easydata360)

---

## 🔍 Documentação Adicional
- [Documentação da API](docs/api.md)
- [Guia de Estilo](docs/style-guide.md)
- [FAQ](docs/faq.md)

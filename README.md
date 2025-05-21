
# 📋 Sistema de Avaliação 5S - SENAI Birigui

Este projeto tem como objetivo facilitar e digitalizar o processo de **avaliação 5S** dos ambientes escolares do SENAI de Birigui. A plataforma permite a aplicação de vistorias, geração de relatórios, acompanhamento de melhorias e agendamento de novas avaliações.

---

## 🚀 Funcionalidades

- Autenticação com diferentes tipos de usuários:
  - 👨‍💼 Gestores
  - 🔍 Inspetores
  - 👨‍🎓 Alunos (opcional)

- Cadastro e organização de ambientes por:
  - Tipo (sala de aula, laboratório de TI, oficina, etc.)
  - Bloco (Bloco A, Bloco B, Bloco C, ...)

- Registro de avaliações com base nos 5 pilares do 5S:
  - Seiri, Seiton, Seisō, Seiketsu e Shitsuke

- Cadastro de perguntas:
  - Gerais
  - Por tipo de ambiente
  - Por bloco
  - Por ambiente específico

- Interface de checklist com:
  - Notas (0 a 5)
  - Observações
  - Upload de fotos

- Dashboard interativo com filtros e gráficos

- Exportação de relatórios por ambiente em PDF

- Tela de calendário:
  - Exibe vistorias passadas
  - Permite agendamentos futuros
  - Mostra responsáveis e status

---

## 🛠️ Tecnologias Utilizadas

### Backend
- Python 3.11+
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-Login / JWT
- ReportLab ou WeasyPrint (geração de PDFs)

### Frontend Web
- React.js
- React Router
- Context API
- Chart.js / Recharts
- FullCalendar

### Banco de Dados
- PostgreSQL (produção)
- SQLite (desenvolvimento/local)

### Outros
- Docker (futuro)
- Firebase Storage ou Cloudinary (para imagens)
- Vercel / Render / Railway (hospedagem)

---

## 📂 Estrutura de Diretórios

```
/backend
  ├── models/
  ├── controllers/
  ├── routes/
  ├── templates/
  ├── static/
  ├── config.py
  ├── app.py

/frontend
  ├── components/
  ├── pages/
  ├── services/
  ├── assets/
  ├── App.jsx
```

---

## 🧱 Modelo de Dados (Resumo)

### Usuários
- Inspetores, Gestores e Alunos

### Ambientes
- Tipo + Bloco + Nome

### Perguntas
- Classificadas por escopo (geral, tipo, bloco, ambiente)

### Avaliações
- Pontuação por pilar do 5S
- Observações e imagens

### Vistorias
- Datas futuras ou realizadas
- Vinculadas às avaliações

---

## 📅 Funcionalidade de Calendário

- Visualização por mês e semana
- Filtro por ambiente, tipo e bloco
- Agendamentos e histórico de vistorias
- Acesso rápido aos relatórios

---

## 📄 Exportação de Relatórios

- Geração de PDF por ambiente
- Inclui:
  - Nota média geral
  - Notas por pilar
  - Observações
  - Sugestões de melhoria
  - Evidências visuais

---

## 📌 Como Executar (em breve)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
flask db upgrade
flask run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## 📌 Roadmap Futuro

- [ ] Aplicativo mobile (React Native)
- [ ] Módulo de notificações e lembretes
- [ ] Integração com serviços de login institucional
- [ ] Controle de ações corretivas

---

## 👨‍🏫 Projeto desenvolvido por
Equipe SENAI Birigui + EasyData360

---

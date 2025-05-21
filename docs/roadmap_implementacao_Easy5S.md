
# 🚀 Roadmap de Implementação - Projeto Easy5S

## 📅 Fase 0 - Pré-lançamento (Sprint 0)
### 🔧 Infraestrutura
- [ ] Definir cronograma detalhado com milestones por sprint (usando GitHub Projects)
- [ ] Criar organização e repositórios no GitHub (backend/frontend)
- [ ] Configurar Git Flow e branch protection rules
- [ ] Implementar templates padrão (PR, issues, commits)

### 🛠️ Configuração de Ambientes
| Ambiente | Stack | Responsável |
|----------|-------|-------------|
| Dev Local | Docker Compose (PostgreSQL+PGAdmin) | Todos |
| Homologação | VM Azure (2vCPU/4GB) | DevOps |
| Produção | Render (Backend) + Vercel (Frontend) | DevOps |

- [ ] Configurar arquivos `.env.example` com variáveis críticas:
  ```plaintext
  # Backend
  FLASK_SECRET_KEY=gerar_com_openssl
  DATABASE_URL=postgresql://user:pass@host/db
  JWT_SECRET_KEY=gerar_com_openssl

  # Frontend
  VITE_API_BASE_URL=https://api.easy5s.dev
  ```

## 📌 Fase 1 - Núcleo do Sistema (Sprints 1-3)
### 🔐 Módulo de Autenticação
**Backend:**
- [ ] Model `Usuario` (id, nome, email, senha_hash, perfil, ativo)
- [ ] Endpoints:
  ```python
  POST /auth/login      # Retorna JWT
  POST /auth/refresh    # Renova token
  GET /auth/me          # Dados do usuário logado
  ```
- [ ] Middleware de autenticação JWT
- [ ] Criptografia com Argon2 (senhas)

**Frontend:**
- [ ] Contexto de autenticação com:
  ```typescript
  interface AuthState {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
  }
  ```
- [ ] Telas:
  - Login com validação de formulário
  - Redirecionamento pós-autenticação

### 🏗️ Entidades Básicas
**Modelagem inicial:**

![img.png](img.png)
```mermaid
erDiagram
  USUARIO ||--o{ AVALIACAO : realiza
  AMBIENTE ||--o{ AVALIACAO : pertence
  AVALIACAO ||--o{ RESPOSTA : contém
  PERGUNTA ||--o{ RESPOSTA : referencia
```

**CRUDs prioritários:**
1. Ambientes (nome, bloco, tipo, status)
2. Perguntas (texto, escopo, peso, pilar_5s)
3. Vistorias (data, responsavel_id, ambiente_id)

## 📌 Fase 2 - Funcionalidades Chave (Sprints 4-6)
### ✔️ Módulo de Avaliação
**Fluxo completo:**
1. Selecionar ambiente → Carregar perguntas filtradas
2. Responder por pilar (Seiri, Seiton, etc.)
3. Upload de imagens (compressor de imagens no front)
4. Submissão com confirmação

**Endpoints críticos:**
```python
POST /avaliacoes       # Cria nova avaliação
GET /avaliacoes/{id}   # Recupera avaliação completa
GET /perguntas         # Filtro por ?escopo=geral|tipo|bloco|ambiente
```

### 📊 Dashboard Analítico
**Métricas essenciais:**
- Conformidade geral (%) por período
- Média por pilar 5S
- Top 5 ambientes (melhores/piores)

**Tecnologias:**
- Recharts para gráficos
- react-query para data fetching
- date-fns para manipulação de datas

## 📌 Fase 3 - Relatórios e Gestão (Sprints 7-8)
### 📄 Geração de Relatórios
**Opções de exportação:**
1. PDF (WeasyPrint)
   - Cabeçalho com logo SENAI
   - Notas por pilar
   - Observações críticas
   - Gráfico evolutivo
2. Excel (openpyxl)
   - Dados brutos
   - Cálculos automáticos

**Endpoint:**
```python
GET /relatorios/ambientes/{id}?formato=pdf|excel
```

### 🗓️ Calendário de Vistorias
**Recursos:**
- Visualização mensal/semanal
- Drag & drop para reagendamento
- Notificações por email (Celery)
- Integração com Google Calendar API

**Model:**
```python
class Vistoria(db.Model):
    __tablename__ = 'vistorias'
    id = db.Column(db.Integer, primary_key=True)
    data_prevista = db.Column(db.DateTime, nullable=False)
    realizada = db.Column(db.Boolean, default=False)
    ambiente_id = db.Column(db.Integer, db.ForeignKey('ambientes.id'))
```

## ✅ Checklist de Qualidade (Todas as Fases)
### 🧪 Testes
| Tipo | Backend | Frontend |
|------|---------|----------|
| Unitários | pytest (95% coverage) | Jest + Testing Library |
| Integração | pytest + requests | Cypress Component Testing |
| E2E | Locust (performance) | Cypress (fluxos críticos) |

### 🔍 Code Quality
- [ ] SonarCloud integrado ao CI
- [ ] Linters:
  ```bash
  # Backend
  flake8 --max-complexity=10 --max-line-length=120

  # Frontend
  eslint --fix --ext .ts,.tsx
  ```
- [ ] Dependabot para atualizações de segurança

## 🌐 Deploy Contínuo
**Pipeline exemplo:**
```yaml
name: Production Deployment
on:
  push:
    tags:
      - 'v*.*.*'
jobs:
  deploy:
    steps:
      - name: Deploy Backend
        run: |
          ssh $SSH_USER@$PROD_SERVER \
          "cd /opt/easy5s/backend && \
          git pull && \
          flask db upgrade && \
          sudo systemctl restart easy5s.service"
```

## 📈 Pós-lançamento
- [ ] Monitoramento com Sentry (erros) + Grafana (métricas)
- [ ] Feedback loops quinzenais com usuários SENAI
- [ ] Retrospectivas técnicas após cada sprint

---

**Priorização Recomendada:**
1. Autenticação e CRUD básico (Sprint 1-2)
2. Módulo de avaliação (Sprint 3-4)  
3. Dashboard e relatórios (Sprint 5-6)
4. Funcionalidades avançadas (Sprint 7+)

**Dicas de Gestão:**
- Usar milestones do GitHub para acompanhamento
- Definir DoR (Definition of Ready) e DoD (Definition of Done)
- Revisões de código obrigatórias para main
- Daily meetings de 15min focados em blockers

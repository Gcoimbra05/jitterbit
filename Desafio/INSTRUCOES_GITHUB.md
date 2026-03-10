# Instruções para GitHub

## 📝 Preparando o Projeto para GitHub

Esta é uma guia passo a passo para hospedar o projeto em um repositório público no GitHub.

---

## 1️⃣ Criar Repositório no GitHub

### Opção A: Via Website GitHub.com

1. Acesse [GitHub.com](https://github.com)
2. Faça login na sua conta
3. Clique no ícone **+** no topo direito → **New repository**
4. Preencha os dados:
   - **Repository name**: `order-management-api`
   - **Description**: `API para gerenciar pedidos com Node.js e MongoDB`
   - **Public** (para um repositório público)
   - Não inicialize com README (já temos um)
5. Clique em **Create repository**

### Opção B: Via GitHub CLI (se tiver instalado)

```bash
gh repo create order-management-api --public --source=. --remote=origin
```

---

## 2️⃣ Configurar Git Localmente

### Primeiro, configure suas credenciais do Git:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@email.com"
```

### Navegue até o diretório do projeto:

```bash
cd c:\projetos\P_S\Jitterbit\Desafio
```

### Inicialize um repositório Git (se ainda não tiver):

```bash
git init
```

### Adicione o repositório remoto do GitHub:

```bash
git remote add origin https://github.com/SEUSUSERNAME/order-management-api.git
```

**Substitua `SEUSUSERNAME` pelo seu usuário do GitHub!**

---

## 3️⃣ Fazer o Primeiro Commit

### Verifique o status:

```bash
git status
```

### Adicione todos os arquivos:

```bash
git add .
```

### Crie o primeiro commit com mensagem clara:

```bash
git commit -m "feat: implementar API de gerenciamento de pedidos com CRUD completo"
```

### Envie para GitHub:

```bash
git branch -M main
git push -u origin main
```

---

## 4️⃣ Estrutura de Commits Recomendada

Para um projeto bem organizado, use commits semânticos:

### Tipos de commit:

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Documentação
- **style**: Formatação de código
- **refactor**: Refatoração de código
- **test**: Testes
- **chore**: Tarefas gerais

### Exemplos de commits bons:

```bash
# Criar estrutura inicial
git commit -m "chore: criar estrutura inicial do projeto com package.json"

# Implementar conexão com MongoDB
git commit -m "feat: implementar conexão com MongoDB através do Mongoose"

# Implementar endpoints
git commit -m "feat: criar endpoints CRUD para gerenciamento de pedidos"

# Adicionar tratamento de erros
git commit -m "feat: adicionar tratamento robusto de erros em todos endpoints"

# Adicionar validação
git commit -m "feat: implementar validação e transformação de dados"

# Adicionar documentação
git commit -m "docs: adicionar README com documentação completa da API"

# Adicionar exemplos
git commit -m "docs: adicionar arquivo requests.http com exemplos de requisições"
```

---

## 5️⃣ Arquivo .gitignore

✅ Já foi criado! Verifica se contém:

```
node_modules/
.env
.env.local
.vscode/
.idea/
*.log
```

Isso evita subir para GitHub:
- Dependências (podem ser reinstaladas com `npm install`)
- Variáveis sensíveis (como chaves do MongoDB)
- Arquivos de IDE

---

## 6️⃣ Atualizações Futuras

Quando fizer alterações, use:

```bash
# Ver mudanças
git status

# Adicionar mudanças
git add .

# Fazer commit
git commit -m "tipo: descrição da mudança"

# Enviar para GitHub
git push origin main
```

---

## 7️⃣ Configurar Branch Protection (Opcional)

Para um projeto mais profissional:

1. Vá ao repositório no GitHub
2. **Settings** → **Branches**
3. **Add rule** na branch `main`
4. Requer pull request reviews antes de merge
5. Requer que checks passem antes de merge

---

## 🔒 Proteger Informações Sensíveis

### ❌ Nunca comite:
- `.env` com senhas reais
- Chaves API ou tokens
- Credenciais do banco de dados
- Informações sensíveis

### ✅ Ao invés disso:
1. Use `.env.example` como template
2. Usuários copiam para `.env` localmente
3. Adicione `.env` ao `.gitignore`

Exemplo `.env.example`:
```
MONGODB_URI=mongodb://localhost:27017/order-management
NODE_ENV=development
PORT=3000
```

---

## 📋 Checklist Final

- [ ] Repositório criado no GitHub
- [ ] URL remota configurada localmente
- [ ] `.gitignore` configurado corretamente
- [ ] Primeiro commit feito com mensagem clara
- [ ] Push realizado com sucesso
- [ ] `.env` não está no repositório (apenas `.env.example`)
- [ ] `README.md` está bem estruturado
- [ ] `package.json` com dependências corretas
- [ ] Código comentado e organizado
- [ ] Commits organizados em main

---

## 🔗 Links Úteis

- [GitHub Docs](https://docs.github.com/)
- [Git Cheat Sheet](https://github.github.com/training-kit/downloads/github-git-cheat-sheet.pdf)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

---

## ❓ Dúvidas Frequentes

### P: Esqueci de fazer push, como faço agora?
**R:** 
```bash
git push -u origin main
```

### P: Preciso atualizar um commit anterior?
**R:** 
```bash
git add .
git commit --amend --no-edit
git push -f origin main
```
(Use `--force` com cuidado!)

### P: Como vejo o histórico de commits?
**R:**
```bash
git log --oneline
```

### P: E se der erro de autenticação?
**R:** Use GitHub CLI ou configure SSH:
```bash
git remote set-url origin git@github.com:SEUSUSERNAME/order-management-api.git
```

---

## 🎉 Parabéns!

Seu projeto está no GitHub pronto para ser compartilhado e colaborado!

**Próximos passos sugeridos:**
1. Adicionar CI/CD com GitHub Actions
2. Configurar branch protection rules
3. Adicionar badges ao README
4. Configurar labels e templates
5. Documentar guia de contribuição

---

Desenvolvido com ❤️

# API de Gerenciamento de Pedidos

Uma API REST simples e robusta para gerenciar pedidos, desenvolvida com **Node.js**, **Express.js** e **MySQL**.

> Atualização: este projeto foi adaptado para MySQL. Para criar estrutura e dados de exemplo, importe [mysql_dump_exemplo.sql](mysql_dump_exemplo.sql).

## 📋 Sumário

- [Recursos](#recursos)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Exemplos de Requisição](#exemplos-de-requisição)
- [Estrutura de Dados](#estrutura-de-dados)
- [Tratamento de Erros](#tratamento-de-erros)
- [Licença](#licença)

## 🚀 Recursos

- ✅ **CRUD Completo**: Criar, ler, atualizar e deletar pedidos
- ✅ **Transformação de Dados**: Mapeamento automático entre formatos de requisição e banco de dados
- ✅ **Validação Robusto**: Validação em todos os campos obrigatórios
- ✅ **Tratamento de Erros**: Mensagens de erro claras e códigos HTTP apropriados
- ✅ **Paginação**: Suporte a limite, skip e ordenação na listagem
- ✅ **MySQL**: Persistência de dados relacional com tabelas normalizadas
- ✅ **CORS Habilitado**: Permite requisições de diferentes origens

## 📦 Pré-requisitos

- **Node.js** v14.0.0 ou superior
- **MySQL** v8.0 ou superior
- **npm** ou **yarn**

### Instalar Node.js

Se você não tem Node.js instalado:
- [Download Node.js](https://nodejs.org/)

### Instalar MySQL

Para usar localmente:
- [Download MySQL Community Server](https://dev.mysql.com/downloads/mysql/)
- Ou use [MySQL Installer](https://dev.mysql.com/downloads/installer/) no Windows

## 📥 Instalação

1. **Clone ou baixe o repositório**

```bash
cd c:\projetos\P_S\Jitterbit\Desafio
```

2. **Instale as dependências**

```bash
npm install
```

## ⚙️ Configuração

1. **Crie um arquivo `.env`** na raiz do projeto (ou use o fornecido)

```env
# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=senha
DB_NAME=order_management
NODE_ENV=development

# Server Configuration
PORT=3000
HOST=localhost
```

Para popular o banco com estrutura e dados de exemplo, importe o dump:

```bash
mysql -u root -p < mysql_dump_exemplo.sql
```

## 🚀 Uso

### Iniciar o servidor em modo de produção

```bash
npm start
```

### Iniciar em modo desenvolvimento (com hot-reload)

```bash
npm run dev
```

O servidor estará rodando em: **http://localhost:3000**

Você verá uma mensagem similar a:

```
╔════════════════════════════════════════╗
║  API de Gerenciamento de Pedidos       ║
║  Server rodando em http://localhost:3000      ║
║  Banco de Dados: MySQL                 ║
╚════════════════════════════════════════╝
```

## 📡 Endpoints

### 1. Criar Novo Pedido

**POST** `/order`

Cria um novo pedido no banco de dados.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

**Resposta (201 Created):**
```json
{
  "success": true,
  "message": "Pedido criado com sucesso",
  "data": {
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 1,
        "valorItem": 1000
      }
    ]
  }
}
```

---

### 2. Obter Pedido por Número

**GET** `/order/:numeroPedido`

Obtém os dados de um pedido específico.

**Exemplo URL:** `http://localhost:3000/order/v10089016vdb`

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Pedido encontrado",
  "data": {
    "numeroPedido": "v10089016vdb",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.000Z",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 1,
        "valorItem": 1000
      }
    ]
  }
}
```

**Resposta (404 Not Found):**
```json
{
  "success": false,
  "message": "Pedido com número v10089016vdb não encontrado"
}
```

---

### 3. Listar Todos os Pedidos

**GET** `/order/list`

Lista todos os pedidos com suporte a paginação e ordenação.

**Query Parameters:**
- `limit` (opcional): Número máximo de pedidos a retornar (padrão: 100, máx: 500)
- `skip` (opcional): Número de pedidos a pular (padrão: 0)
- `sort` (opcional): Campo para ordenar (padrão: -creationDate)

**Exemplo URL:** `http://localhost:3000/order/list?limit=10&skip=0&sort=-creationDate`

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Pedidos listados com sucesso",
  "data": {
    "total": 5,
    "limit": 10,
    "skip": 0,
    "count": 5,
    "orders": [
      {
        "numeroPedido": "v10089015vdb-01",
        "valorTotal": 10000,
        "dataCriacao": "2023-07-19T12:24:11.000Z",
        "items": [
          {
            "idItem": "2434",
            "quantidadeItem": 1,
            "valorItem": 1000
          }
        ]
      }
    ]
  }
}
```

---

### 4. Atualizar Pedido

**PUT** `/order/:numeroPedido`

Atualiza um pedido existente.

**Exemplo URL:** `http://localhost:3000/order/v10089016vdb`

**Body:** (mesmo formato de criação)
```json
{
  "numeroPedido": "v10089016vdb",
  "valorTotal": 15000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 2,
      "valorItem": 1000
    }
  ]
}
```

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Pedido atualizado com sucesso",
  "data": {
    "numeroPedido": "v10089016vdb",
    "valorTotal": 15000,
    "dataCriacao": "2023-07-19T12:24:11.000Z",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 2,
        "valorItem": 1000
      }
    ]
  }
}
```

---

### 5. Deletar Pedido

**DELETE** `/order/:numeroPedido`

Deleta um pedido do banco de dados.

**Exemplo URL:** `http://localhost:3000/order/v10089016vdb`

**Resposta (200 OK):**
```json
{
  "success": true,
  "message": "Pedido deletado com sucesso",
  "data": null
}
```

---

### 6. Health Check

**GET** `/health`

Verifica se a API está rodando.

**Resposta (200 OK):**
```json
{
  "status": "API rodando com sucesso!"
}
```

---

## 📝 Exemplos de Requisição

### Usando cURL

**Criar Pedido:**
```bash
curl --location 'http://localhost:3000/order' \
--header 'Content-Type: application/json' \
--data '{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}'
```

**Obter Pedido:**
```bash
curl --location 'http://localhost:3000/order/v10089015vdb-01'
```

**Listar Pedidos:**
```bash
curl --location 'http://localhost:3000/order/list'
```

**Atualizar Pedido:**
```bash
curl --location --request PUT 'http://localhost:3000/order/v10089015vdb-01' \
--header 'Content-Type: application/json' \
--data '{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 12000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 2,
      "valorItem": 1000
    }
  ]
}'
```

**Deletar Pedido:**
```bash
curl --location --request DELETE 'http://localhost:3000/order/v10089015vdb-01'
```

### Usando Postman

1. Importe as requisições no Postman
2. Configure a URL base: `http://localhost:3000`
3. Use os exemplos acima em cada requisição

### Usando VS Code Rest Client Extension

Crie um arquivo `requests.http`:

```http
### Criar Pedido
POST http://localhost:3000/order HTTP/1.1
Content-Type: application/json

{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}

### Obter Pedido
GET http://localhost:3000/order/v10089015vdb-01 HTTP/1.1

### Listar Pedidos
GET http://localhost:3000/order/list HTTP/1.1

### Atualizar Pedido
PUT http://localhost:3000/order/v10089015vdb-01 HTTP/1.1
Content-Type: application/json

{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 12000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 2,
      "valorItem": 1000
    }
  ]
}

### Deletar Pedido
DELETE http://localhost:3000/order/v10089015vdb-01 HTTP/1.1
```

---

## 📊 Estrutura de Dados

### Tabela: orders

```javascript
{
  id: Number,
  orderId: String,          // Identificador único do pedido (ex: v10089015vdb-01)
  value: Number,            // Valor total do pedido
  creationDate: Date,       // Data de criação do pedido
  createdAt: Date,          // Data de criação (automático)
  updatedAt: Date           // Data de última atualização (automático)
}
```

### Tabela: order_items

```javascript
{
  id: Number,
  orderRefId: Number,       // Chave estrangeira para orders.id
  productId: String,
  quantity: Number,
  price: Number
}
```

### Transformação de Dados

**Entrada (Request):**
```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ]
}
```

**Transformação:**
| Campo Input | Campo BD | Transformação |
|-------------|----------|---------------|
| numeroPedido | orderId | 1:1 |
| valorTotal | value | 1:1 |
| dataCriacao | creationDate | Convertido para Date |
| items[].idItem | items[].productId | Renomeado |
| items[].quantidadeItem | items[].quantity | Renomeado |
| items[].valorItem | items[].price | Renomeado |

---

## ❌ Tratamento de Erros

A API retorna os seguintes códigos HTTP e mensagens de erro padronizadas:

### Estrutura de Erro

```json
{
  "success": false,
  "message": "Descrição do erro",
  "errors": null
}
```

### Códigos de Erro

| Código | Descrição | Exemplo |
|--------|-----------|---------|
| 400 | Bad Request - Validação inválida | Campo obrigatório ausente |
| 404 | Not Found - Recurso não encontrado | Pedido não existe |
| 409 | Conflict - Conflito de dados | Pedido com esse ID já existe |
| 500 | Internal Server Error | Erro no servidor |

### Exemplos de Erro

**Pedido não encontrado (404):**
```json
{
  "success": false,
  "message": "Pedido com número v10089016vdb não encontrado"
}
```

**Campo obrigatório ausente (400):**
```json
{
  "success": false,
  "message": "Erro ao criar pedido: numeroPedido é obrigatório"
}
```

**Pedido duplicado (409):**
```json
{
  "success": false,
  "message": "Pedido com número v10089015vdb-01 já existe"
}
```

---

## 🏗️ Estrutura do Projeto

```
Desafio/
├── desafio.js           # Arquivo principal da API
├── package.json         # Dependências do projeto
├── .env                 # Variáveis de ambiente
├── .env.example         # Template de variáveis (para GitHub)
├── .gitignore          # Arquivos a ignorar no Git
├── README.md           # Esta documentação
└── requests.http       # Exemplos de requisições
```

---

## 🔧 Tecnologias Utilizadas

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **MySQL** - Banco de dados relacional
- **mysql2** - Driver MySQL para Node.js
- **CORS** - Middleware para requisições entre domínios
- **dotenv** - Gerenciamento de variáveis de ambiente

---

## 📋 Checklist de Requisitos

- [x] Criar novo pedido (POST /order)
- [x] Obter pedido por número (GET /order/:numeroPedido)
- [x] Listar todos os pedidos (GET /order/list)
- [x] Atualizar pedido (PUT /order/:numeroPedido)
- [x] Deletar pedido (DELETE /order/:numeroPedido)
- [x] Armazenar em MySQL
- [x] Transformação/Mapeamento de dados
- [x] Códigos HTTP apropriados
- [x] Tratamento robusto de erros
- [x] Código comentado e organizado
- [x] Convenções de nomenclatura adequadas
- [x] Documentação completa

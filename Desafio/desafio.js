/**
 * API para Gerenciar Pedidos
 * Desenvolvida com Node.js, Express e MySQL
 * 
 * Endpoints disponíveis:
 * - POST   /order              - Criar novo pedido
 * - GET    /order/:numeroPedido - Obter pedido pelo número
 * - GET    /order/list         - Listar todos os pedidos
 * - PUT    /order/:numeroPedido - Atualizar pedido
 * - DELETE /order/:numeroPedido - Deletar pedido
 */

require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

// ===========================
// CONFIGURAÇÃO DA APLICAÇÃO
// ===========================
const app = express();
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'order_management';
let pool;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// ===========================
// CONEXÃO COM MYSQL
// ===========================
async function initializeDatabase() {
  pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  await pool.query('SELECT 1');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id BIGINT NOT NULL AUTO_INCREMENT,
      order_id VARCHAR(120) NOT NULL,
      value DECIMAL(12, 2) NOT NULL,
      creation_date DATETIME NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_orders_order_id (order_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id BIGINT NOT NULL AUTO_INCREMENT,
      order_ref_id BIGINT NOT NULL,
      product_id VARCHAR(120) NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(12, 2) NOT NULL,
      PRIMARY KEY (id),
      KEY idx_order_items_order_ref_id (order_ref_id),
      CONSTRAINT fk_order_items_order_ref_id
        FOREIGN KEY (order_ref_id) REFERENCES orders(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

// ===========================
// FUNÇÕES AUXILIARES
// ===========================

/**
 * Transforma dados do request para o formato do banco de dados
 * @param {Object} inputData - Dados recebidos do cliente
 * @returns {Object} Dados transformados para o banco
 */
function transformOrderData(inputData) {
  // Validar campos obrigatórios
  if (!inputData.numeroPedido) {
    throw new Error('numeroPedido é obrigatório');
  }
  if (!inputData.valorTotal && inputData.valorTotal !== 0) {
    throw new Error('valorTotal é obrigatório');
  }
  if (Number.isNaN(Number(inputData.valorTotal))) {
    throw new Error('valorTotal deve ser numérico');
  }
  if (!inputData.dataCriacao) {
    throw new Error('dataCriacao é obrigatória');
  }
  if (!Array.isArray(inputData.items) || inputData.items.length === 0) {
    throw new Error('items deve ser um array não vazio');
  }

  // Transformar items
  const transformedItems = inputData.items.map((item) => {
    if (!item.idItem) throw new Error('idItem é obrigatório em cada item');
    if (!item.quantidadeItem) throw new Error('quantidadeItem é obrigatório em cada item');
    if (item.valorItem === undefined) throw new Error('valorItem é obrigatório em cada item');

    if (Number(item.quantidadeItem) <= 0) {
      throw new Error('quantidadeItem deve ser maior que zero');
    }
    if (Number(item.valorItem) < 0) {
      throw new Error('valorItem não pode ser negativo');
    }

    return {
      productId: item.idItem,
      quantity: Number(item.quantidadeItem),
      price: Number(item.valorItem),
    };
  });

  const parsedCreationDate = new Date(inputData.dataCriacao);
  if (Number.isNaN(parsedCreationDate.getTime())) {
    throw new Error('dataCriacao inválida');
  }

  // Retornar dados no formato do banco
  return {
    orderId: inputData.numeroPedido,
    value: Number(inputData.valorTotal),
    creationDate: parsedCreationDate,
    items: transformedItems,
  };
}

/**
 * Transforma dados do banco para o formato da resposta
 * @param {Object} dbData - Dados do banco de dados
 * @returns {Object} Dados formatados para resposta
 */
function formatOrderResponse(dbData) {
  return {
    numeroPedido: dbData.orderId,
    valorTotal: Number(dbData.value),
    dataCriacao: dbData.creationDate,
    items: dbData.items.map((item) => ({
      idItem: item.productId,
      quantidadeItem: item.quantity,
      valorItem: Number(item.price),
    })),
  };
}

function mapSortParameter(sortInput) {
  const sort = sortInput || '-creationDate';
  const direction = sort.startsWith('-') ? 'DESC' : 'ASC';
  const field = sort.replace('-', '');

  const allowedFields = {
    creationDate: 'creation_date',
    orderId: 'order_id',
    value: 'value',
  };

  const column = allowedFields[field] || 'creation_date';
  return { column, direction };
}

async function findOrderWithItemsByOrderId(orderId, connection = pool) {
  const [orders] = await connection.execute(
    `SELECT id, order_id, value, creation_date
     FROM orders
     WHERE order_id = ?`,
    [orderId]
  );

  if (orders.length === 0) {
    return null;
  }

  const order = orders[0];
  const [items] = await connection.execute(
    `SELECT product_id, quantity, price
     FROM order_items
     WHERE order_ref_id = ?
     ORDER BY id ASC`,
    [order.id]
  );

  return {
    id: order.id,
    orderId: order.order_id,
    value: Number(order.value),
    creationDate: order.creation_date,
    items: items.map((item) => ({
      productId: item.product_id,
      quantity: item.quantity,
      price: Number(item.price),
    })),
  };
}

/**
 * Retorna resposta padronizada de sucesso
 */
function successResponse(res, data, message = 'Operação realizada com sucesso', statusCode = 200) {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Retorna resposta padronizada de erro
 */
function errorResponse(res, message, statusCode = 400, errors = null) {
  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}

// ===========================
// ENDPOINTS DA API
// ===========================

/**
 * POST /order
 * Criar um novo pedido
 * 
 * Body esperado:
 * {
 *   "numeroPedido": "v10089015vdb-01",
 *   "valorTotal": 10000,
 *   "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
 *   "items": [
 *     {
 *       "idItem": "2434",
 *       "quantidadeItem": 1,
 *       "valorItem": 1000
 *     }
 *   ]
 * }
 */
app.post('/order', async (req, res) => {
  let connection;

  try {
    // Validar e transformar dados
    const transformedData = transformOrderData(req.body);

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Verificar se já existe pedido com este número
    const [existingOrder] = await connection.execute(
      'SELECT id FROM orders WHERE order_id = ?',
      [transformedData.orderId]
    );
    if (existingOrder.length > 0) {
      await connection.rollback();
      return errorResponse(
        res,
        `Pedido com número ${transformedData.orderId} já existe`,
        409 // Conflict
      );
    }

    // Criar novo pedido no banco de dados
    const [insertResult] = await connection.execute(
      `INSERT INTO orders (order_id, value, creation_date)
       VALUES (?, ?, ?)`,
      [transformedData.orderId, transformedData.value, transformedData.creationDate]
    );

    const itemValues = transformedData.items.map((item) => [
      insertResult.insertId,
      item.productId,
      item.quantity,
      item.price,
    ]);

    await connection.query(
      'INSERT INTO order_items (order_ref_id, product_id, quantity, price) VALUES ?',
      [itemValues]
    );

    await connection.commit();

    // Retornar resposta com dados formatados
    const responseData = formatOrderResponse(transformedData);
    successResponse(res, responseData, 'Pedido criado com sucesso', 201);
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Erro ao criar pedido:', error.message);
    errorResponse(res, `Erro ao criar pedido: ${error.message}`, 400);
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

/**
 * GET /order/:numeroPedido
 * Obter os dados de um pedido específico pelo número
 * 
 * Parâmetro: numeroPedido (ex: v10089016vdb)
 */
app.get('/order/:numeroPedido', async (req, res) => {
  try {
    const { numeroPedido } = req.params;

    if (!numeroPedido || numeroPedido.trim() === '') {
      return errorResponse(res, 'numeroPedido é obrigatório na URL', 400);
    }

    // Buscar pedido no banco de dados
    const order = await findOrderWithItemsByOrderId(numeroPedido);

    if (!order) {
      return errorResponse(res, `Pedido com número ${numeroPedido} não encontrado`, 404);
    }

    // Retornar resposta com dados formatados
    const responseData = formatOrderResponse(order);
    successResponse(res, responseData, 'Pedido encontrado');
  } catch (error) {
    console.error('Erro ao obter pedido:', error.message);
    errorResponse(res, `Erro ao obter pedido: ${error.message}`, 500);
  }
});

/**
 * GET /order/list
 * Listar todos os pedidos
 * 
 * Query params:
 * - limit: número máximo de pedidos (padrão: 100)
 * - skip: número de pedidos para pular (padrão: 0)
 * - sort: campo para ordenar (padrão: -creationDate)
 */
app.get('/order/list', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 100, 500);
    const skip = parseInt(req.query.skip) || 0;
    const sort = req.query.sort;
    const { column, direction } = mapSortParameter(sort);

    // Buscar pedidos com paginação
    const [orders] = await pool.execute(
      `SELECT id, order_id, value, creation_date
       FROM orders
       ORDER BY ${column} ${direction}
       LIMIT ? OFFSET ?`,
      [limit, skip]
    );

    // Contar total de pedidos
    const [countRows] = await pool.execute('SELECT COUNT(*) AS total FROM orders');
    const total = countRows[0].total;

    let responseData = [];

    if (orders.length > 0) {
      const orderIds = orders.map((order) => order.id);
      const placeholders = orderIds.map(() => '?').join(', ');

      const [items] = await pool.execute(
        `SELECT order_ref_id, product_id, quantity, price
         FROM order_items
         WHERE order_ref_id IN (${placeholders})
         ORDER BY id ASC`,
        orderIds
      );

      const itemsByOrderId = new Map();
      for (const item of items) {
        if (!itemsByOrderId.has(item.order_ref_id)) {
          itemsByOrderId.set(item.order_ref_id, []);
        }
        itemsByOrderId.get(item.order_ref_id).push({
          productId: item.product_id,
          quantity: item.quantity,
          price: Number(item.price),
        });
      }

      responseData = orders.map((order) =>
        formatOrderResponse({
          orderId: order.order_id,
          value: Number(order.value),
          creationDate: order.creation_date,
          items: itemsByOrderId.get(order.id) || [],
        })
      );
    }

    // Formatar resposta
    successResponse(
      res,
      {
        total,
        limit,
        skip,
        count: orders.length,
        orders: responseData,
      },
      'Pedidos listados com sucesso'
    );
  } catch (error) {
    console.error('Erro ao listar pedidos:', error.message);
    errorResponse(res, `Erro ao listar pedidos: ${error.message}`, 500);
  }
});

/**
 * PUT /order/:numeroPedido
 * Atualizar um pedido existente
 * 
 * Parâmetro: numeroPedido (ex: v10089016vdb)
 * Body: dados a serem atualizados (mesmo formato de criação)
 */
app.put('/order/:numeroPedido', async (req, res) => {
  let connection;

  try {
    const { numeroPedido } = req.params;

    if (!numeroPedido || numeroPedido.trim() === '') {
      return errorResponse(res, 'numeroPedido é obrigatório na URL', 400);
    }

    // Buscar pedido existente
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const order = await findOrderWithItemsByOrderId(numeroPedido, connection);

    if (!order) {
      await connection.rollback();
      return errorResponse(res, `Pedido com número ${numeroPedido} não encontrado`, 404);
    }

    // Validar e transformar dados
    const transformedData = transformOrderData(req.body);

    // Verificar se o numeroPedido foi alterado para um que já existe
    if (
      transformedData.orderId !== numeroPedido &&
      (
        await connection.execute('SELECT id FROM orders WHERE order_id = ?', [
          transformedData.orderId,
        ])
      )[0].length > 0
    ) {
      await connection.rollback();
      return errorResponse(
        res,
        `Pedido com número ${transformedData.orderId} já existe`,
        409
      );
    }

    // Atualizar pedido
    await connection.execute(
      `UPDATE orders
       SET order_id = ?, value = ?, creation_date = ?
       WHERE id = ?`,
      [transformedData.orderId, transformedData.value, transformedData.creationDate, order.id]
    );

    await connection.execute('DELETE FROM order_items WHERE order_ref_id = ?', [order.id]);

    const itemValues = transformedData.items.map((item) => [
      order.id,
      item.productId,
      item.quantity,
      item.price,
    ]);

    await connection.query(
      'INSERT INTO order_items (order_ref_id, product_id, quantity, price) VALUES ?',
      [itemValues]
    );

    await connection.commit();

    // Retornar resposta com dados formatados
    const responseData = formatOrderResponse(transformedData);
    successResponse(res, responseData, 'Pedido atualizado com sucesso');
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Erro ao atualizar pedido:', error.message);
    errorResponse(res, `Erro ao atualizar pedido: ${error.message}`, 400);
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

/**
 * DELETE /order/:numeroPedido
 * Deletar um pedido
 * 
 * Parâmetro: numeroPedido (ex: v10089016vdb)
 */
app.delete('/order/:numeroPedido', async (req, res) => {
  try {
    const { numeroPedido } = req.params;

    if (!numeroPedido || numeroPedido.trim() === '') {
      return errorResponse(res, 'numeroPedido é obrigatório na URL', 400);
    }

    // Buscar e deletar pedido
    const [result] = await pool.execute('DELETE FROM orders WHERE order_id = ?', [numeroPedido]);

    if (result.affectedRows === 0) {
      return errorResponse(res, `Pedido com número ${numeroPedido} não encontrado`, 404);
    }

    successResponse(res, null, 'Pedido deletado com sucesso');
  } catch (error) {
    console.error('Erro ao deletar pedido:', error.message);
    errorResponse(res, `Erro ao deletar pedido: ${error.message}`, 500);
  }
});

/**
 * Health Check
 * GET /health
 */
app.get('/health', (req, res) => {
  res.json({ status: 'API rodando com sucesso!' });
});

/**
 * Tratamento de rota não encontrada (404)
 */
app.use((req, res) => {
  errorResponse(res, 'Rota não encontrada. Verifique a URL e o método HTTP.', 404);
});

/**
 * Tratamento global de erros
 */
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  errorResponse(
    res,
    'Erro interno do servidor. Por favor, tente novamente mais tarde.',
    500,
    process.env.NODE_ENV === 'development' ? err.message : undefined
  );
});

// ===========================
// INICIAR SERVIDOR
// ===========================
initializeDatabase()
  .then(() => {
    console.log('✓ Conectado ao MySQL com sucesso!');
    app.listen(PORT, () => {
      console.log(`\n╔════════════════════════════════════════╗`);
      console.log(`║  API de Gerenciamento de Pedidos       ║`);
      console.log(`║  Server rodando em http://localhost:${PORT}      ║`);
      console.log(`║  Banco de Dados: MySQL                 ║`);
      console.log(`╚════════════════════════════════════════╝\n`);
    });
  })
  .catch((err) => {
    console.error('✗ Erro ao conectar ao MySQL:', err.message);
    process.exit(1);
  });

module.exports = app;

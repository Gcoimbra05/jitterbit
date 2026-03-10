-- Dump de exemplo para MySQL 8+
-- Cria estrutura e dados iniciais para a API de pedidos.

CREATE DATABASE IF NOT EXISTS order_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE order_management;

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

INSERT INTO orders (order_id, value, creation_date)
VALUES
  ('v10089015vdb-01', 10000.00, '2023-07-19 12:24:11'),
  ('v10089016vdb-02', 5000.00, '2023-07-20 10:30:00'),
  ('v10089017vdb-03', 20000.00, '2023-07-21 14:15:00')
ON DUPLICATE KEY UPDATE
  value = VALUES(value),
  creation_date = VALUES(creation_date);

INSERT INTO order_items (order_ref_id, product_id, quantity, price)
SELECT o.id, '2434', 1, 1000.00
FROM orders o
WHERE o.order_id = 'v10089015vdb-01'
  AND NOT EXISTS (
    SELECT 1
    FROM order_items i
    WHERE i.order_ref_id = o.id
      AND i.product_id = '2434'
  );

INSERT INTO order_items (order_ref_id, product_id, quantity, price)
SELECT o.id, '2435', 2, 4500.00
FROM orders o
WHERE o.order_id = 'v10089015vdb-01'
  AND NOT EXISTS (
    SELECT 1
    FROM order_items i
    WHERE i.order_ref_id = o.id
      AND i.product_id = '2435'
  );

INSERT INTO order_items (order_ref_id, product_id, quantity, price)
SELECT o.id, '3000', 5, 1000.00
FROM orders o
WHERE o.order_id = 'v10089016vdb-02'
  AND NOT EXISTS (
    SELECT 1
    FROM order_items i
    WHERE i.order_ref_id = o.id
      AND i.product_id = '3000'
  );

INSERT INTO order_items (order_ref_id, product_id, quantity, price)
SELECT o.id, '4000', 1, 20000.00
FROM orders o
WHERE o.order_id = 'v10089017vdb-03'
  AND NOT EXISTS (
    SELECT 1
    FROM order_items i
    WHERE i.order_ref_id = o.id
      AND i.product_id = '4000'
  );

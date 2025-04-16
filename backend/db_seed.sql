-- Clients
INSERT INTO clients (name) VALUES 
  ('Alice'),
  ('Bob'),
  ('Charlie'),
  ('Diana'),
  ('Evelyn');

-- Positions for Alice (Client ID 1)
INSERT INTO positions (client_id, symbol, quantity, cost_basis)
VALUES
  (1, 'AAPL', 100, 150.00),
  (1, 'MSFT', 200, 280.00);

-- Positions for Bob (Client ID 2)
INSERT INTO positions (client_id, symbol, quantity, cost_basis)
VALUES
  (2, 'GOOGL', 50, 2700.00),
  (2, 'TSLA', 30, 750.00);

-- Positions for Charlie (Client ID 3)
INSERT INTO positions (client_id, symbol, quantity, cost_basis)
VALUES
  (3, 'NFLX', 40, 500.00),
  (3, 'AAPL', 70, 160.00);

-- Positions for Diana (Client ID 4)
INSERT INTO positions (client_id, symbol, quantity, cost_basis)
VALUES
  (4, 'NVDA', 25, 500.00),
  (4, 'MSFT', 60, 290.00);

-- Positions for Evelyn (Client ID 5)
INSERT INTO positions (client_id, symbol, quantity, cost_basis)
VALUES
  (5, 'AMZN', 10, 3300.00),
  (5, 'TSLA', 20, 780.00);

-- Margin Loans
INSERT INTO margin (client_id, loan_amount)
VALUES 
  (1, 30000.00),
  (2, 50000.00),
  (3, 20000.00),
  (4, 15000.00),
  (5, 40000.00);

-- Latest market data (non-historical, one row per symbol)
INSERT INTO market_data (symbol, current_price) VALUES
  ('AAPL', 175.80),
  ('MSFT', 312.40),
  ('GOOGL', 2785.50),
  ('TSLA', 790.00),
  ('NFLX', 510.00),
  ('NVDA', 495.00),
  ('AMZN', 3385.00);

-- Set initial value of mmr to 0.25
INSERT INTO settings (key, value) VALUES ('mmr', 0.25);

-- USERS
-- Passwords (bcryptjs-hashed versions of 'admin123' and 'client123')
-- These were precomputed using bcryptjs with 10 salt rounds
INSERT INTO users (email, name, password, role, client_id) VALUES
  ('admin@example.com', 'Hans', '$2a$10$s8XgGQe5YqjMz4X07nZ0y.IG8V5TOD9IsFOXZe1TbGLKX/ESHmQU6', 'admin', NULL),
  ('alice@example.com', 'Alice', '$2a$10$6R.23wuRD1J.PRMz2bSSbezJPIcSirqsw.UcWVLigB5k6507qDYiG', 'client', 1),
  ('bob@example.com',   'Bob', '$2a$10$6R.23wuRD1J.PRMz2bSSbezJPIcSirqsw.UcWVLigB5k6507qDYiG', 'client', 2),
  ('charlie@example.com', 'Charlie', '$2a$10$6R.23wuRD1J.PRMz2bSSbezJPIcSirqsw.UcWVLigB5k6507qDYiG', 'client', 3),
  ('diana@example.com', 'Diana', '$2a$10$6R.23wuRD1J.PRMz2bSSbezJPIcSirqsw.UcWVLigB5k6507qDYiG', 'client', 4),
  ('evelyn@example.com', 'Evelyn', '$2a$10$6R.23wuRD1J.PRMz2bSSbezJPIcSirqsw.UcWVLigB5k6507qDYiG', 'client', 5);




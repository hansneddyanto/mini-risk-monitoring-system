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
  (4, 'TSLA', 25, 500.00),
  (4, 'MSFT', 60, 290.00);

-- Positions for Evelyn (Client ID 5)
INSERT INTO positions (client_id, symbol, quantity, cost_basis)
VALUES
  (5, 'AAPL', 10, 3300.00),
  (5, 'TSLA', 20, 780.00);

-- Margin Loans
INSERT INTO margin (client_id, loan_amount)
VALUES 
  (1, 30000.00),
  (2, 50000.00),
  (3, 20000.00),
  (4, 15000.00),
  (5, 40000.00);

-- Historical Market Data: 5 stocks × 7 days
INSERT INTO market_data (symbol, price, timestamp) VALUES
-- AAPL
('AAPL', 172.30, NOW() - INTERVAL '7 days'),
('AAPL', 173.20, NOW() - INTERVAL '6 days'),
('AAPL', 174.10, NOW() - INTERVAL '5 days'),
('AAPL', 175.00, NOW() - INTERVAL '4 days'),
('AAPL', 175.80, NOW() - INTERVAL '3 days'),
('AAPL', 174.90, NOW() - INTERVAL '2 days'),
('AAPL', 175.40, NOW() - INTERVAL '1 day'),

-- MSFT
('MSFT', 305.10, NOW() - INTERVAL '7 days'),
('MSFT', 308.90, NOW() - INTERVAL '6 days'),
('MSFT', 310.20, NOW() - INTERVAL '5 days'),
('MSFT', 311.00, NOW() - INTERVAL '4 days'),
('MSFT', 312.40, NOW() - INTERVAL '3 days'),
('MSFT', 311.70, NOW() - INTERVAL '2 days'),
('MSFT', 312.10, NOW() - INTERVAL '1 day'),

-- TSLA
('TSLA', 775.00, NOW() - INTERVAL '7 days'),
('TSLA', 780.00, NOW() - INTERVAL '6 days'),
('TSLA', 785.00, NOW() - INTERVAL '5 days'),
('TSLA', 788.00, NOW() - INTERVAL '4 days'),
('TSLA', 790.00, NOW() - INTERVAL '3 days'),
('TSLA', 791.00, NOW() - INTERVAL '2 days'),
('TSLA', 792.00, NOW() - INTERVAL '1 day'),

-- GOOGL
('GOOGL', 2760.00, NOW() - INTERVAL '7 days'),
('GOOGL', 2770.00, NOW() - INTERVAL '6 days'),
('GOOGL', 2780.00, NOW() - INTERVAL '5 days'),
('GOOGL', 2785.00, NOW() - INTERVAL '4 days'),
('GOOGL', 2785.50, NOW() - INTERVAL '3 days'),
('GOOGL', 2786.00, NOW() - INTERVAL '2 days'),
('GOOGL', 2786.50, NOW() - INTERVAL '1 day'),

-- NFLX
('NFLX', 505.00, NOW() - INTERVAL '7 days'),
('NFLX', 507.00, NOW() - INTERVAL '6 days'),
('NFLX', 509.00, NOW() - INTERVAL '5 days'),
('NFLX', 510.00, NOW() - INTERVAL '4 days'),
('NFLX', 510.50, NOW() - INTERVAL '3 days'),
('NFLX', 509.50, NOW() - INTERVAL '2 days'),
('NFLX', 510.00, NOW() - INTERVAL '1 day');

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




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

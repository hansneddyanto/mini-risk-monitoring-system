-- Add a sample client
INSERT INTO clients (name) VALUES ('Alice');

-- Add positions for Alice (client_id = 1)
INSERT INTO positions (client_id, symbol, quantity, cost_basis)
VALUES
  (1, 'AAPL', 100, 150.00),
  (1, 'MSFT', 200, 280.00);

-- Add current market prices
INSERT INTO market_data (symbol, current_price)
VALUES
  ('AAPL', 170.00),
  ('MSFT', 310.00);

-- Add margin loan details
INSERT INTO margin (client_id, loan_amount)
VALUES (1, 30000.00);

CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    symbol VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL,
    cost_basis NUMERIC(10, 2) NOT NULL
);

CREATE TABLE market_data (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL UNIQUE,
    current_price NUMERIC(10, 2) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE margin (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    loan_amount NUMERIC(12, 2) NOT NULL,
    margin_requirement NUMERIC(12, 2),
    net_equity NUMERIC(12, 2),
    margin_shortfall NUMERIC(12, 2),
    margin_call BOOLEAN DEFAULT FALSE
);

CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value NUMERIC
);


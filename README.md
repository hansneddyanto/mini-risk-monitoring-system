# Mini Risk Monitoring System

This project is a full-stack risk monitoring dashboard that helps clients track their portfolio positions and margin risk in real time. Built as a take-home assignment, it demonstrates full-stack capabilities including database design, backend API development, frontend integration, and containerization.

---

## Architecture Overview

```
Frontend (React + Nginx)
          |
          v
Backend (Node.js + Express)
          |
          v
Database (PostgreSQL)
```

---

## Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Frontend   | React, Axios, Nginx       |
| Backend    | Node.js, Express, dotenv  |
| Database   | PostgreSQL                |
| Container  | Docker, Docker Compose    |

---

## Features

- Portfolio position display with real-time or seeded prices
- Simplified margin calculation logic:
  - Portfolio Market Value
  - Net Equity
  - Maintenance Margin Requirement (25%)
  - Margin Shortfall
  - Margin Call alert
- REST API integration between backend and frontend
- One-command setup with Docker Compose
- Seeded data for easy demonstration

---

## Getting Started with Docker

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed on your system

### Installation

1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/mini-risk-monitoring-system.git
cd mini-risk-monitoring-system
```

2. Run the application using Docker Compose

```bash
docker-compose up --build
```

3. Open your browser and access:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:3001/api/positions/1](http://localhost:3001/api/positions/1)

---

## API Endpoints

| Method | Endpoint                          | Description                                |
|--------|-----------------------------------|--------------------------------------------|
| GET    | `/api/positions/:clientId`        | Retrieve client stock holdings              |
| GET    | `/api/margin-status/:clientId`    | Get margin calculation result for a client  |

---

## Default Demo Data

| Client | Holdings                            | Loan Amount | Margin Call |
|--------|-------------------------------------|-------------|--------------|
| Alice  | 100 AAPL @ $150, 200 MSFT @ $280    | $30,000     | Based on margin shortfall |

All data is seeded automatically on first container startup.

---

## Project Structure

```
mini-risk-monitoring-system/
├── backend/
│   ├── Dockerfile
│   ├── .env
│   └── src/
│       ├── index.js
│       ├── db.js
│       └── routes/
├── frontend/
│   ├── Dockerfile
│   └── src/
│       └── App.js
├── db_schema.sql
├── db_seed.sql
├── docker-compose.yml
└── README.md
```

---

## Known Limitations

- Market data is seeded; no live API integration
- No authentication or client login
- UI is minimal and functional by design

---

## Future Improvements

- Integrate real-time stock data API (e.g., Alpha Vantage)
- Add user login with authentication
- Visualize data using charts
- Send notifications or alerts for margin calls

---

## Author

Hans  
Built as part of a full-stack developer technical assignment.

# Mini Risk Monitoring System

A full-stack application for monitoring margin risks, viewing portfolio positions, and analyzing market data.

---

## 1. High-Level Architecture

The system is composed of three main layers:

```
[ Frontend (React + TailwindCSS) ]
        ↓  HTTP
[ Backend (Node.js + Express) ]
        ↓  SQL
[ Database (PostgreSQL via Docker) ]
```

### Description

- **Frontend**: React app served via Nginx. Allows admin and clients to view dashboards, sync data, and interact with charts.
- **Backend**: RESTful API built with Express.js. Handles authentication, portfolio logic, margin rules, and serves data.
- **Database**: PostgreSQL stores clients, positions, margin loans, and historical market data.

---

## 2. Setup / Installation

### Prerequisites

- Docker

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/hansneddyanto/mini-risk-monitoring-system.git
cd mini-risk-monitoring-system

# 2. Build and start all services
docker-compose up --build
```

### Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

PostgreSQL volume is mounted, so data persists even after `docker-compose down`.

---

## 3. Tech Stack Explanation

| Layer      | Technology          | Reason for Choice                                  |
|------------|---------------------|-----------------------------------------------------|
| Frontend   | React, TailwindCSS  | Component-based, easy state handling, responsive UI |
| Backend    | Node.js, Express    | Lightweight and scalable REST API                   |
| Database   | PostgreSQL          | Strong relational model, supports aggregate queries |
| Deployment | Docker              | Easy local setup and container orchestration        |

---

## 4. Usage

### Login Credentials

| Role   | Email               | Password   |
|--------|---------------------|------------|
| Admin  | admin@example.com   | admin123   |
| Client | alice@example.com   | client123  |

### Features

- Admin:
  - View all clients’ positions and margin status
  - Modify MMR (Maintenance Margin Requirement)
  - Visualize aggregate data via bar and pie charts
  - Sync market data prices
- Client:
  - View only their own portfolio and margin status
  - Explore market data

### Tabs

- **Dashboard**: Portfolio and margin overview
- **Market Data**: Historical prices of stocks in a line chart with symbol selector
- **Data Visualizations**: Aggregate charts (admin only)

---

## 5. Testing

### Manual Testing

- **Postman** was used to test all API endpoints.
- **Frontend** was validated through interaction, including:
  - Margin call display
  - Chart rendering
  - MMR setting and updating
- Sample endpoints tested:
  - `GET /api/positions/:clientId`
  - `GET /api/margin-status/:clientId`
  - `POST /api/mmr`
  - `GET /api/market-data/`
  - `GET /api/market-data/:symbol`

### Unit Testing

- The **margin logic** is unit tested in `backend/__tests__/marginUtils.test.js`.
- These tests verify:
  - Correct calculation of margin requirement and shortfall
  - Accurate margin call triggering
  - Edge cases such as exact threshold or zero portfolio/loan

#### How to Run

```bash
cd backend
npm install --save-dev jest
npx jest
```

---

## 6. Known Limitations

- Market prices are mocked using ; real-time APIs are not used
- Changes on MMR and syncing of market price data is reflected only after changing tabs/selections
- No sorting/pagination on tables
- No email verification, password reset, or multi-admin support

---

## Final Notes

This project simulates a basic margin trading risk monitor. While simple in logic, it sets the foundation for enterprise-ready tools in trading and risk analytics.
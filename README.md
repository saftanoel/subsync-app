# 🔄 SubSync

> **Course Assignment:** MPP (Systems/Software Engineering)
> **Status:** 🥇 Assignment 3 - Gold Challenge Completed 🏆

SubSync is a modern, full-stack web application designed to help users manage their monthly and annual subscriptions, track expenses, and view insightful charts. The project features a robust React frontend and a FastAPI backend, utilizing a hybrid database architecture (SQLite + MongoDB), real-time WebSockets, and advanced security mechanisms.

## ✨ Assignment 3: Hybrid Databases & Security (NEW)

The application has been successfully migrated from in-memory mock data to a robust, production-ready persistence layer, achieving all requirements for the Assignment 3 **Bronze**, **Silver**, and **Gold** challenges:

### 🥇 Gold Challenge (Security & Anomaly Detection)
- **Audit Logging:** Every critical action (e.g., deleting a subscription) is intercepted and logged immutably into a MongoDB `audit_logs` collection.
- **Automated Anomaly Detection:** An asynchronous security algorithm monitors user behavior. If a user performs bulk deletions (3+ deletes within 10 seconds), they are automatically flagged.
- **Admin Observation Dashboard:** A dedicated, visually distinct UI component (`AdminObservationList`) fetches flagged users in real-time. This component uses conditional rendering and is strictly visible only to authenticated Administrators.

### 🥈 Silver Challenge (RBAC & Real-Time NoSQL Chat)
- **Role-Based Access Control (RBAC):** Users are now authenticated against a relational SQLite database. Users are mapped to specific roles (`admin`, `user`) with inherited permissions. 
- **Hybrid Data Strategy:** Structured data (Users, Subscriptions) lives in strict 3NF SQLite tables, while high-velocity, unstructured data (Chat logs, Audit logs) lives in MongoDB.
- **Real-Time WebSocket Chat:** Implemented a full-stack live chat system. The React `ChatComponent` connects via WebSockets to the FastAPI backend, automatically pulling message history from MongoDB and rendering new incoming messages instantly across multiple clients.

### 🥉 Bronze Challenge (Relational Persistence)
- **SQLAlchemy ORM & SQLite:** Completely rewrote the data access layer to persist Subscriptions and Payments into a relational database.
- **Alembic Database Migrations:** Implemented strict version control for the database schema. All changes to tables are tracked and can be safely rolled back using Alembic.
- **Database Seeding:** Created a `seed.py` automation script to instantly populate the database with test users and necessary RBAC roles.

---

## 🕰️ Assignment 2: GraphQL & Offline Capabilities (Previous)
- **GraphQL Integration:** Data fetching utilizes a GraphQL architecture (`Strawberry`), allowing exact data shape requests.
- **Fullstack 1-to-Many Relationship:** Subscriptions -> Payments logic implemented with deep nesting.
- **Offline-First Support:** Detects network drops and caches data in `localStorage`. Automatically syncs offline-created entities upon reconnection.
- **E2E Testing:** Playwright automated testing for critical UI journeys.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + Shadcn UI + Framer Motion
- **State & Storage:** React Context API + LocalStorage 
- **Testing:** Playwright (E2E)

### Backend
- **Framework:** FastAPI (Python)
- **Relational Database:** SQLite3 + SQLAlchemy (ORM) + Alembic (Migrations)
- **NoSQL Database:** MongoDB + Motor (Async Driver)
- **Real-Time:** WebSockets (`websockets` library)
- **API Architecture:** REST + GraphQL (Strawberry)
- **Testing:** pytest

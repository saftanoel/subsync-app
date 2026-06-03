# 🔄 SubSync

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![GraphQL](https://img.shields.io/badge/-GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-%2346E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

> **Course Assignment:** MPP (Systems/Software Engineering)
> **Status:** 🥇 Assignment 3 & 4 - Security, Hybrid DBs & Cloud Deployment 🏆

SubSync is a modern, full-stack web application designed to help users manage their monthly and annual subscriptions, track expenses, and view insightful charts. The project features a robust React frontend and a FastAPI backend, utilizing a hybrid database architecture (SQLite + MongoDB), real-time WebSockets, and advanced security mechanisms.

## ✨ Assignment 3 & 4: Hybrid Databases, Security & Cloud

The application has been successfully migrated from in-memory mock data to a robust, production-ready persistence layer and deployed to the cloud, achieving all requirements for the Assignment **Bronze**, **Silver**, and **Gold** challenges:

### 🛡️ Advanced Security & 3-Step Authentication (3FA)
Implemented a strict, multi-stage login flow to ensure maximum account security:
1. **Credentials:** Standard email and password validation.
2. **Email Verification (OTP):** A dynamically generated 6-digit OTP is sent via the **Resend HTTP API** directly to the user's registered email address, bypassing strict cloud port limitations.
3. **Security Question:** Users must answer a personal security question (e.g., childhood nickname) configured during registration. Answers are cryptographically hashed before being stored in MongoDB.

### 🥇 Gold Challenge (Security & Anomaly Detection)
- **Audit Logging:** Every critical action (e.g., deleting a subscription) is intercepted and logged immutably into a MongoDB `audit_logs` collection.
- **Automated Anomaly Detection:** An asynchronous security algorithm monitors user behavior. If a user performs bulk deletions (3+ deletes within 10 seconds), they are automatically flagged.
- **Admin Observation Dashboard:** A dedicated, visually distinct UI component (`AdminObservationList`) fetches flagged users in real-time. This component uses conditional rendering and is strictly visible only to authenticated Administrators.
- **Fail-Safe Architecture:** The MongoDB data layer is fortified with strict `serverSelectionTimeoutMS` configurations and graceful error handling to prevent server lockups during network failures.

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
- **Email API:** Resend HTTP API (via `httpx`/`requests`)
- **API Architecture:** REST + GraphQL (Strawberry)
- **Testing:** pytest

### Cloud & Deployment
- **Frontend Hosting:** Vercel (CI/CD Pipeline)
- **Backend Hosting:** Render Web Services
- **Database Hosting:** MongoDB Atlas

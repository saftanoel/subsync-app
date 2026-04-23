# 🔄 SubSync

> **Course Assignment:** MPP (Systems/Software Engineering)
> **Status:** 🥇 Gold Challenge Completed 🏆

SubSync is a modern, full-stack web application designed to help users manage their monthly and annual subscriptions, track expenses, and view insightful charts. The project features a robust React frontend and a FastAPI backend, heavily utilizing real-time communication, offline-first capabilities, and GraphQL networking.

## ✨ Current Features & Achievements

The application currently satisfies all requirements for the **Bronze**, **Silver**, and **Gold** challenges:

### 🥇 Gold Challenge (Expert Level)
- **GraphQL Integration:** Migrated data fetching to a GraphQL architecture using `Strawberry` in Python, allowing the frontend to request exact data shapes and complex relationships efficiently.
- **Fullstack 1-to-Many Relationship:** Implemented a robust "1-to-Many" data model (Subscriptions -> Payments). Users can perform CRUD operations on individual payments attached to specific subscriptions, with changes persisting through the GraphQL mutations to the backend.
- **Network Optimization (Prefetching):** Engineered a smart prefetching system for pagination. The React client silently downloads the next page of data in the background, resulting in zero-latency "Infinite Scroll" and instantaneous UI updates.
- **Comprehensive Backend Testing:** Developed a strict Unit Testing suite for the Python backend using `pytest`, successfully passing 10/10 test cases for core logic and data integrity.
- **End-to-End (E2E) UI Testing:** Integrated `Playwright` to automate and verify critical user journeys in the browser (rendering, CRUD operations, UI responsiveness), ensuring a completely stable frontend.

### 🥈 Silver Challenge (Advanced Architecture)
- **Offline-First Support:** The app detects network/server drops (`navigator.onLine` + WebSocket drops) and seamlessly transitions to an Offline Mode, caching all data and new CRUD operations in `localStorage`.
- **Smart Data Synchronization:** Upon server reconnection, the frontend automatically merges offline-created entities with the server data, preventing duplicate IDs and ensuring zero data loss.
- **Real-Time Data Generator:** The backend features asynchronous background tasks (`asyncio`) that programmatically generate fake but valid subscriptions using the `Faker` library.
- **WebSocket Integration:** The backend maintains an open pipe with the client, broadcasting newly generated mock data in real-time. The React UI (tables and charts) updates reactively without any page reloads or polling.

### 🥉 Bronze Challenge (Core Foundations)
- **Full CRUD Operations:** Users can add, view, update, and delete subscriptions both on the client and server side.
- **Server-Side Validation:** Strict backend validation using `Pydantic` (e.g., regex for billing cycles, float > 0 for costs, min/max limits for ratings).
- **In-Memory Storage:** As per requirements, backend data is stored solely in RAM (no persistent DB), utilizing server-side pagination (`skip`, `limit`).
- **Master-to-Detail Navigation:** Interactive UI where clicking a subscription row opens a detailed view modal with relational data (Payment History).
- **Responsive & Themed UI:** Fully optimized for mobile viewports with persistent Dark/Light modes, glassmorphism UI, and smooth Framer Motion transitions.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Animations:** Framer Motion
- **State & Storage:** React Context API + LocalStorage + js-cookie
- **Testing:** Playwright (E2E)
- **Networking:** Native Fetch API (GraphQL queries/mutations)

### Backend
- **Framework:** FastAPI (Python)
- **API Architecture:** GraphQL (Strawberry)
- **Real-Time:** WebSockets (`websockets` library)
- **Async Processing:** Python `asyncio`
- **Data Validation:** Pydantic
- **Mock Data:** Faker
- **Testing:** pytest

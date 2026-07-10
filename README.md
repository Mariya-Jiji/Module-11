# Fullstack Application

## Project Overview
This project is a complete, modern web application built for high performance and clean separation of concerns. It features a fully decoupled architecture, separating the user interface from the business logic and database management, ensuring scalability and maintainability.

## Tech Stack
### Frontend
- **Next.js (App Router)**: The React framework used for building the user interface.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI styling.
- **TypeScript**: Ensuring type safety across the entire application.

### Backend
- **Node.js + Hono**: A lightning-fast, serverless-ready web framework used to serve REST APIs and handle authentication.
- **Prisma ORM**: Type-safe database client and schema management.
- **PostgreSQL**: Relational database (compatible with Neon or serverless DBs).
- **JWT (JSON Web Tokens)**: Used for secure, stateless authentication via HttpOnly cookies.

## Architecture Explanation
This repository uses a decoupled frontend/backend architecture, replacing the standard Next.js monolith. 
### Why the split?
1. **Security & Isolation**: Database credentials and Prisma logic are strictly isolated within the backend, preventing accidental exposure to the frontend environment.
2. **Scalability**: The frontend (UI only) can be deployed to edge networks (like Vercel) while the backend can run on infrastructure optimized for persistent database connections (like Render or Railway).
3. **Flexibility**: The backend exposes standard REST APIs, making it trivial to build a mobile app or a public API in the future without untangling Next.js Server Actions.

## Folder Structure
```text
/ (Root)
├── frontend/ (Next.js UI)
│   ├── app/ (UI only)
│   ├── components/
│   ├── hooks/
│   ├── .env (NEXT_PUBLIC_API_URL)
│   └── package.json (Next.js deps only)
│
└── backend/ (Hono + Node.js)
    ├── src/
    │   ├── routes/
    │   ├── middleware/
    │   └── lib/ (mailer, prisma, etc.)
    ├── prisma/
    ├── .env (DATABASE_URL, JWT_SECRET)
    └── package.json (Hono, Prisma, bcryptjs)
```

## Setup Instructions

### 1. Install Dependencies
You need to install dependencies in all three directories (root, frontend, and backend):
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 2. Environment Variables
Ensure you have created the `.env` files in both directories based on their `.env.example` equivalents:
- `/frontend/.env`: Set `NEXT_PUBLIC_API_URL=http://localhost:8787`
- `/backend/.env`: Set `DATABASE_URL`, `JWT_SECRET`, and email server credentials.

### 3. Run the Development Servers
From the **root** of the repository, you can start both the frontend and backend servers simultaneously using `concurrently`:
```bash
npm run dev
```
- **Frontend** runs on: `http://localhost:3000`
- **Backend** runs on: `http://localhost:8787`

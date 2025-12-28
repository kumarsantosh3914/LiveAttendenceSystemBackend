# Express TypeScript Starter Project

This repository contains the backend service for a live attendance management system built with Express + TypeScript, MongoDB, JWT authentication, and Socket.IO.

## Overview

The server exposes REST APIs under:

- `/api/v1/...` (primary)
- `/api/v2/...` (present but currently empty)

And a WebSocket endpoint (Socket.IO):

- `ws://localhost:<PORT>/ws`

## Tech Stack

- Node.js
- Express (TypeScript)
- MongoDB + Mongoose
- JWT Authentication (`jsonwebtoken`)
- Role-based authorization (student/teacher/admin)
- Socket.IO (real-time attendance)
- Zod (request validation)
- Winston logging

## Features

- **Authentication**
  - Signup / Signin
  - JWT token generation
  - Protected profile endpoint
- **Role-Based Access Control (RBAC)**
  - Roles: `student`, `teacher`, `admin`
- **Classes**
  - Create, update, delete classes (teacher/admin)
  - Add/remove students in a class (teacher/admin)
  - Fetch classes by teacher/student
- **Attendance**
  - CRUD attendance records (teacher/admin)
  - Mark student attendance (teacher/admin)
  - Date-range queries + class statistics
- **Real-time attendance (WebSocket)**
  - JWT-authenticated socket connections
  - Teacher broadcasts attendance updates and summaries
  - Student can request their own attendance status

## Prerequisites

- Node.js (recommended: latest LTS)
- npm
- MongoDB (local or cloud)

## Environment Variables

Environment variables are loaded from `.env` via `dotenv`.

**Required** (validated at startup in `src/config/index.ts`):

- `MONGODB_URI`
- `JWT_SECRET`

**Optional**:

- `PORT` (default: `3000`)
- `JWT_EXPIRES_IN` (default: `7d`)
- `SALT_ROUNDS` (default: `10`)
- `NODE_ENV` (`development` / `production`)

Example `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/attendance_db
JWT_SECRET=your-super-long-secret-at-least-32-chars
JWT_EXPIRES_IN=7d
SALT_ROUNDS=10
NODE_ENV=development
```

## Install & Run

Install dependencies:

```bash
npm install
```

Run in development:

```bash
npm run dev
```

Run (ts-node):

```bash
npm start
```

Server entrypoint: `src/server.ts`

## Authentication

After signup/signin, the API returns:

- `token` (JWT)
- `user` (safe user details)

For protected endpoints, send:

```http
Authorization: Bearer <token>
```

## API Routes

Base URL: `http://localhost:<PORT>/api/v1`

### Ping

- `GET /ping/` -> `{ "message": "pong" }`
- `GET /ping/helth` -> `"OK"`

### Users

- `POST /users/signup`
- `POST /users/signin`
- `GET /users/me` (auth)
- `GET /users/students` (auth + teacher/admin)

### Classes (all routes require auth)

- `POST /classes/` (teacher/admin)
- `GET /classes/`
- `GET /classes/teacher/:teacherId`
- `GET /classes/student/:studentId`
- `GET /classes/:id/details`
- `GET /classes/:id/my-attendance` (student)
- `GET /classes/:id`
- `PUT /classes/:id` (teacher/admin)
- `DELETE /classes/:id` (teacher/admin)
- `POST /classes/:id/students` (teacher/admin)
- `DELETE /classes/:id/students/:studentId` (teacher/admin)

### Attendance (all routes require auth)

- `POST /attendence/start` (teacher/admin)
- `POST /attendence/` (teacher/admin)
- `GET /attendence/`
- `GET /attendence/class/:classId`
- `GET /attendence/student/:studentId`
- `GET /attendence/class/:classId/student/:studentId`
- `GET /attendence/class/:classId/statistics`
- `GET /attendence/class/:classId/date-range?startDate=...&endDate=...`
- `POST /attendence/class/:classId/student/:studentId/mark` (teacher/admin)
- `GET /attendence/:id`
- `PUT /attendence/:id` (teacher/admin)
- `DELETE /attendence/:id` (teacher/admin)

## WebSocket (Socket.IO)

WebSocket server is available at:

- Path: `/ws`
- Authentication: pass JWT as query string `token`

Example (conceptual):

- `ws://localhost:<PORT>/ws?token=<JWT>`

All messages use a `message` event envelope:

```json
{ "event": "EVENT_NAME", "data": {} }
```

Supported events:

- `ATTENDANCE_MARKED` (teacher only)
- `TODAY_SUMMARY` (teacher only)
- `MY_ATTENDANCE` (student only)
- `DONE` (teacher only)

## Project Structure

- `src/server.ts` - Express + HTTP server, router registration, websocket init, DB connect
- `src/config/` - env, logger, DB, websocket
- `src/routers/` - versioned API routers
- `src/controllers/` - request handlers
- `src/services/` - business logic
- `src/repositores/` - DB/data access
- `src/models/` - Mongoose models
- `src/middlewares/` - auth, error handling, correlation id
- `src/validators/` - Zod schemas
- `src/utils/` - utilities (includes in-memory attendance session)

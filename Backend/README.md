# Karya — Backend

Karya (package name `taskforge`) is the REST API powering a full-stack project and task management platform. It lets individuals and teams create projects, invite members, assign and track tasks, and discuss work through comments — all in one place.

Built with **Node.js**, **Express 5**, and **MongoDB (Mongoose)**, with JWT-based authentication and interactive API docs via **Swagger**.

## Features

- **Authentication** — register/login with hashed passwords (bcrypt) and JWT-based sessions
- **Projects** — create, update, delete projects, and manage members with roles (`owner`, `admin`, `member`)
- **Tasks** — create, update, delete, and assign tasks within a project, with `status` (`todo`, `in-progress`, `completed`), `priority` (`low`, `medium`, `high`), and due dates
- **Comments** — threaded comments on individual tasks
- **API Documentation** — auto-generated Swagger UI at `/api-docs`

## Tech Stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Runtime        | Node.js (ES Modules)                |
| Framework      | Express 5                           |
| Database       | MongoDB + Mongoose                  |
| Auth           | JWT (jsonwebtoken) + bcrypt/bcryptjs |
| Docs           | swagger-jsdoc + swagger-ui-express  |
| Dev tooling    | nodemon                             |

## Project Structure

```
Backend/
├── config/
│   ├── db.js            # MongoDB connection
│   └── swagger.js       # Swagger/OpenAPI configuration
├── controllers/
│   ├── auth.controller.js
│   ├── comment.controller.js
│   ├── project.controller.js
│   └── task.controller.js
├── middleware/
│   ├── auth.middleware.js           # JWT verification
│   ├── error.middleware.js          # Centralized error handler
│   ├── validateLogin.middleware.js
│   ├── validateRegister.middleware.js
│   ├── validateTask.middleware.js
│   └── validateTaskUpdate.middleware.js
├── models/
│   ├── comment.model.js
│   ├── project.model.js
│   ├── task.model.js
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── comment.routes.js
│   ├── project.routes.js
│   └── task.routes.js
├── server.js             # App entry point
├── package.json
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- A running MongoDB instance (local or a hosted service like MongoDB Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/Be-Less/Karya.git
cd Karya/Backend

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the `Backend/` directory with the following variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Running the Server

```bash
npm start
```

This runs `nodemon server.js`, so the server restarts automatically on file changes. By default the API is available at:

```
http://localhost:3000
```

Interactive API documentation (Swagger UI) is available at:

```
http://localhost:3000/api-docs
```

## API Overview

All endpoints below are prefixed with `/api`. Endpoints marked 🔒 require a `Bearer <token>` in the `Authorization` header.

### Auth (`/api/auth`)

| Method | Endpoint          | Description                  |
|--------|-------------------|-------------------------------|
| POST   | `/register`       | Register a new user          |
| POST   | `/login`          | Log in and receive a JWT     |
| GET    | `/profile` 🔒     | Get the authenticated user   |

### Projects (`/api/projects`)

| Method | Endpoint                     | Description                     |
|--------|-------------------------------|----------------------------------|
| POST   | `/` 🔒                        | Create a project                |
| GET    | `/` 🔒                        | List projects for current user  |
| GET    | `/:id` 🔒                     | Get project details             |
| PUT    | `/:id` 🔒                     | Update a project                |
| DELETE | `/:id` 🔒                     | Delete a project                |
| POST   | `/:id/members` 🔒             | Add a member to a project       |
| DELETE | `/:id/members/:userId` 🔒     | Remove a project member         |

### Tasks (`/api/tasks`)

| Method | Endpoint    | Description                          |
|--------|-------------|----------------------------------------|
| POST   | `/` 🔒      | Create a task (requires `projectId`)  |
| GET    | `/` 🔒      | List tasks across current user's projects |
| GET    | `/:id` 🔒   | Get a single task                     |
| PUT    | `/:id` 🔒   | Update a task                         |
| DELETE | `/:id` 🔒   | Delete a task                         |

### Comments (`/api/tasks/:taskId/comments`)

| Method | Endpoint                        | Description               |
|--------|----------------------------------|----------------------------|
| POST   | `/` 🔒                           | Add a comment to a task   |
| GET    | `/` 🔒                           | List comments on a task   |
| PUT    | `/:commentId` 🔒                 | Update a comment          |
| DELETE | `/:commentId` 🔒                 | Delete a comment          |

For full request/response schemas, see the Swagger UI at `/api-docs` once the server is running.

## Data Models

- **User** — `name`, `email` (unique), `password` (hashed)
- **Project** — `name`, `description`, `owner`, `members` (each with `user` + `role`)
- **Task** — `title`, `description`, `status`, `priority`, `dueDate`, `projectId`, `userId` (creator), `assignedTo`
- **Comment** — `content`, `taskId`, `userId`

## License

ISC
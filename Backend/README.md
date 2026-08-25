# Karya Backend API

A RESTful task and project management backend API built with **Node.js**, **Express**, and **MongoDB**. It features JWT-based authentication, structured task and project management workflows, custom request validation, and interactive Swagger API documentation.

---

## Features

* **Authentication & Authorization**: User registration, login, and secure endpoints using JSON Web Tokens (JWT)[cite: 1].
* **Project Management**: Create, view, and organize projects[cite: 1].
* **Task Management**: Create, update, assign, track, and delete task items within projects[cite: 1].
* **Collaboration**: Task commenting system for project team members[cite: 1].
* **Input Validation & Security**: Middleware-driven request validation and centralized error handling[cite: 1].
* **API Documentation**: Interactive API testing playground powered by Swagger UI[cite: 1].

---

## Tech Stack

* **Runtime**: Node.js[cite: 1]
* **Framework**: Express.js[cite: 1]
* **Database**: MongoDB (via Mongoose schemas)[cite: 1]
* **Authentication**: JSON Web Token (`jsonwebtoken`)[cite: 1]
* **Documentation**: Swagger UI (`swagger-ui-express`)[cite: 1]

---

## Project Structure

```text
Backend/
├── config/
│   ├── db.js                 # Database connection setup
│   └── swagger.js            # Swagger API documentation configuration
├── controllers/
│   ├── auth.controller.js    # Authentication business logic
│   ├── comment.controller.js # Task commenting logic
│   ├── project.controller.js # Project management logic
│   └── task.controller.js    # Task management logic
├── middleware/
│   ├── auth.middleware.js           # JWT authentication check
│   ├── error.middleware.js          # Global error handler
│   ├── validateLogin.middleware.js  # Login input validation
│   ├── validateRegister.middleware.js # Registration validation
│   ├── validateTask.middleware.js   # Task creation validation
│   └── validateTaskUpdate.middleware.js # Task update validation
├── models/
│   ├── comment.model.js      # Comment schema
│   ├── project.model.js      # Project schema
│   ├── task.model.js         # Task schema
│   └── user.model.js         # User schema
├── routes/
│   ├── auth.routes.js        # Auth endpoints
│   ├── comment.routes.js     # Comment endpoints
│   ├── project.routes.js     # Project endpoints
│   └── task.routes.js        # Task endpoints
└── server.js                 # Application entry point
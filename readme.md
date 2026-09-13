# Karya

Karya is a full-stack project and task management application built for teams to manage their work in one place.

The idea is simple: create a project, add your team members, assign tasks, track their progress, and discuss tasks through comments.

> Karya is still under development, so some parts of the application may change as the project grows.

## What can you do with Karya?

* Create an account and log in
* Create projects
* Add members to a project
* Create and assign tasks
* Set task priority and due dates
* Track task status
* Comment on tasks
* Manage your own tasks and comments
* View the available API through Swagger

## Tech Stack

**Frontend**

* React
* TypeScript
* Vite
* React Router

**Backend**

* Node.js
* Express.js
* MongoDB
* Mongoose

**Other**

* JWT for authentication
* bcrypt for password hashing
* Swagger for API documentation
* Git & GitHub

## How it works

A user can create a project and add other users as members.

Tasks belong to a project and can be assigned to one of its members.

```text
User
 │
 └── Project
      │
      ├── Members
      │
      └── Tasks
           │
           └── Comments
```

This structure allows the application to work more like a team management tool rather than a simple todo application.

## Project Structure

```text
Karya/
│
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── Frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── ...
│
└── README.md
```

## Running locally

### Clone the repository

```bash
git clone <repository-url>
cd Karya
```

### Backend

```bash
cd Backend
npm install
```

Create a `.env` file:

```env
PORT=3001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

Then start the server:

```bash
npm run dev
```

### Frontend

Open another terminal:

```bash
cd Frontend
npm install
npm run dev
```

The frontend will then be available on the local URL provided by Vite.

## API Documentation

Swagger documentation is included for the backend API.

When the backend is running, open:

```text
http://localhost:3001/api-docs
```

The documented APIs currently cover:

* Authentication
* Projects
* Tasks
* Comments

## Current Status

Karya is an ongoing project.

The backend currently has the core functionality for authentication, projects, tasks, and comments. The frontend is being developed separately and will continue to evolve as new features are added.

## Why I built this

I wanted to build something that goes beyond a basic CRUD application.

Karya gives me a chance to work with things that appear in actual applications:

* Authentication
* Authorization
* Multiple users
* Relationships between data
* Project-based permissions
* Task assignment
* REST APIs
* React + TypeScript
* API documentation

## Author

**Bilesh Bhasinka**

Backend / Full-Stack Developer

GitHub: **Be-Less**

Portfolio: **bilesh.com.np**

---

*Built while learning, experimenting, breaking things, and fixing them again.*

# Karya — Frontend

Modern React 19 + TypeScript + Tailwind CSS client for the **Karya** project and task management backend.

## Features

- **Authentication**: User Registration, Login, JWT session management, Protected Routes.
- **Dashboard**: High-level workspace metrics (total projects, completion rate, pending tasks, recent activity).
- **Projects**: Create, edit, delete projects, view project details, and manage team members with role badges (`owner`, `admin`, `member`).
- **Tasks & Kanban Board**:
  - 3-column Kanban board (`To Do`, `In Progress`, `Completed`) with quick drag/dropdown status updates.
  - List / Table view toggle.
  - Multi-filtering by project, status, and priority (`Low`, `Medium`, `High`).
  - Task creation and edit modals with due date pickers and assignee selectors.
- **Task Discussions**: Threaded comments on individual tasks with author editing and deletion.

## Getting Started

### 1. Prerequisites
Ensure the backend server is running at `http://localhost:3000`.

```bash
# In Karya/Backend directory:
npm install
npm start
```

### 2. Start the Frontend

```bash
# In Karya/Frontend directory:
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

Configure `.env` if your backend is hosted on a different URL:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

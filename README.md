# To-Do App Backend

A professional-grade, scalable, and delightful task management platform backend, built with Node.js, Express, and MongoDB.

## 🚀 Vision
This is not just another TO-DO app. It's a productivity suite for individuals and teams, featuring:
- Clean, modern UX
- Secure authentication (JWT + Google OAuth)
- Nested todos, reminders, priorities, projects
- Real-time collaboration (Socket.IO-ready)
- Analytics, notifications, and more

## 🛠️ Tech Stack
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** + **Google OAuth** (Passport.js)
- **Socket.IO** (for real-time features)
- **Jest** (for testing)
- **dotenv, cors, helmet, bcrypt, express-rate-limit** (security & config)

## 📁 Folder Structure
```
server/
├── index.js                # Main entry point
├── config/
│   └── db.js               # MongoDB connection logic
├── routes/
│   ├── auth.js             # Auth endpoints
│   ├── tasks.js            # Task endpoints
│   ├── users.js            # User endpoints (future)
│   ├── projects.js         # Project endpoints
│   └── analytics.js        # Analytics endpoints (future)
├── models/
│   ├── User.js             # User schema
│   ├── Task.js             # Task schema
│   └── Project.js          # Project schema
├── middleware/
│   ├── authMiddleware.js   # JWT auth middleware
│   ├── errorHandler.js     # Centralized error handler
├── controllers/
│   ├── authController.js   # Auth logic
│   ├── tasksController.js  # Task logic
│   ├── projectsController.js # Project logic
│   └── ...                 # Other controllers
├── utils/
│   ├── notifier.js         # Notification helpers (future)
│   └── emailService.js     # Email helpers (future)
├── tests/
│   └── ...                 # Test files
├── .env                    # Environment variables (not committed)
├── .env.example            # Example env file
└── README.md               # This file
```

## ⚡ Features (Current)
- User registration & login (JWT)
- Secure password hashing
- Task CRUD (create, read, update, delete, complete)
- Project CRUD (create, read, update, delete)
- Nested todos, priorities, reminders, tags
- Project structure ready for collaboration
- Centralized error handling
- Robust error handling and data normalization for all task/project operations

## 🏁 Getting Started
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up your `.env` file:**
   See `.env.example` for required variables.
3. **Run the server:**
   ```bash
   node index.js
   ```
   The server will start on `http://localhost:5000` (or your specified PORT).

## 🔑 API Endpoints (Core)
- `POST   /api/auth/register` — Register a new user
- `POST   /api/auth/login` — Login and get JWT
- `GET    /api/tasks` — Get all tasks (auth required)
- `POST   /api/tasks` — Create a new task (auth required)
- `GET    /api/tasks/:id` — Get a single task (auth required)
- `PUT    /api/tasks/:id` — Update a task (auth required)
- `DELETE /api/tasks/:id` — Delete a task (auth required)
- `POST   /api/tasks/:id/complete` — Mark task as complete (auth required)
- `GET    /api/projects` — Get all projects (auth required)
- `POST   /api/projects` — Create a new project (auth required)
- `PUT    /api/projects/:id` — Update a project (auth required)
- `DELETE /api/projects/:id` — Delete a project (auth required)

## 📝 Task Creation & Data Flow
- Task creation is robust and validated on both frontend and backend.
- Only valid tasks (with a non-empty title) are saved.
- Project assignment is optional; if "No Project" is selected, the task is saved without a projectId.
- The backend response is normalized so the frontend always uses `id` and `projectId` fields.
- Errors are handled gracefully and surfaced to the user.
- All data is persisted in MongoDB and reflected in the UI in real time.

## 🧱 Next Steps
- Google OAuth
- Notifications & reminders
- Analytics & dashboard
- Testing (Jest)

## 🤝 Contributing
Pull requests and feedback are welcome!

---
**Built with courage, energy, and intelligence.** 

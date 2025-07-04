# Call Management System

A full-stack call management system for call centers, enabling efficient task handling and organization during emergencies.

## 🎯 Project Overview

This application was built to demonstrate proficiency in full-stack TypeScript development. 
It provides a comprehensive solution for managing incoming calls, categorizing them with tags, and tracking associated tasks.

## 🏗️ Architecture

This project follows a monorepo structure with separate client and server applications:

```
call-management-system/
├── apps/
│   ├── client/          # React + TypeScript frontend
│   └── server/          # Express + TypeScript backend
├── package.json         # Root package.json for monorepo
└── README.md
```

### Tech Stack

**Frontend:**
- React 19 with TypeScript
- Redux Toolkit + RTK Query for state management
- React Router v7 for navigation
- Tailwind CSS for styling
- Socket.io-client for real-time updates
- React Toastify for notifications

**Backend:**
- Express 5 with TypeScript
- PostgreSQL with Sequelize ORM
- JWT authentication with refresh tokens
- Socket.io for WebSocket connections
- bcrypt for password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (or Supabase account)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd call-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

**Server (.env in apps/server/):**
```env
# Database
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_db_name
DB_HOST=your_db_host
DB_PORT=5432
DB_URL=postgresql://...

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Client (.env in apps/client/):**
```env
VITE_SERVER_URL=http://localhost:3000
VITE_NODE_ENV=development
```

4. Run the development servers:
```bash
npm run dev
```

This will start both the client (http://localhost:5173) and server (http://localhost:3000) concurrently.

## 🔐 Authentication & Users

The system uses JWT-based authentication with role-based access control:

- **Admin**: Can manage tags, suggested tasks, and their associations
- **User**: Can manage calls, assign tags, and handle tasks

Default credentials are seeded in the deployed version - for local testing, create an admin user via the API.

## 📊 Database Schema

The application uses a relational database with the following key entities:

### Core Entities
- **Users**: Authentication and role management
- **Calls**: Call records created by users
- **Tags**: Categories for organizing calls (e.g., "Emergency", "Fire Department")
- **Tasks**: Actions to be performed (custom or suggested)

### Relationships
- **Call ↔ Tag**: Many-to-many (calls can have multiple tags)
- **Call ↔ Task**: Many-to-many with status tracking
- **Tag ↔ Task**: Many-to-many (suggested tasks per tag)

## 🎨 Key Features Demonstration

### Admin Dashboard
- Create and manage tags (e.g., "Emergency", "Gas Leak")
- Create suggested tasks (e.g., "Notify Fire Department")
- Link suggested tasks to relevant tags
- Real-time updates when tags/tasks are renamed

### User Dashboard
- View and create call records
- Assign multiple tags to calls
- Add custom tasks or select from suggestions
- Track task status with visual indicators

## 🧪 Development

### Available Scripts

**Root level:**
- `npm run dev` - Start both client and server
- `npm run build` - Build both applications
- `npm run lint` - Run linting for both apps
- `npm run format` - Format code with Prettier

**Individual apps:**
- `npm run client:dev` - Start only the client
- `npm run server:dev` - Start only the server

### Code Quality
- ESLint configuration for consistent code style
- Prettier for code formatting
- TypeScript for type safety
- Comprehensive error handling

---

Built by Tamir Kahalany
# Call Management System Server - Express Backend

RESTful API server for the Call Management System with real-time WebSocket support.

## 🚀 Features

- **RESTful API**: Clean, intuitive endpoints
- **JWT Authentication**: Secure token-based auth with refresh tokens
- **Role-Based Access**: Admin and User roles with middleware protection
- **Real-time Updates**: Socket.io for live data synchronization
- **Database ORM**: Sequelize with PostgreSQL
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Centralized error middleware

## 🛠️ Tech Stack

- **Express 5** - Web framework
- **TypeScript** - Type-safe JavaScript
- **Sequelize 6** - PostgreSQL ORM
- **Socket.io** - WebSocket server
- **JWT** - JSON Web Tokens for auth
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📁 Project Structure

```
apps/server/
├── src/
│   ├── config/
│   │   └── database.ts      # Database connection
│   ├── controllers/         # Request handlers
│   │   ├── authController.ts
│   │   ├── callController.ts
│   │   ├── tagController.ts
│   │   └── ...
│   ├── middleware/          # Express middleware
│   │   ├── authMiddleware.ts
│   │   └── errorMiddleware.ts
│   ├── models/              # Sequelize models
│   │   ├── user.ts
│   │   ├── call.ts
│   │   ├── tag.ts
│   │   ├── task.ts
│   │   ├── index.ts.ts     # Model Associations
│   │   └── ...
│   ├── routes/              # API routes
│   │   ├── authRoutes.ts
│   │   ├── callRoutes.ts
│   │   ├── tagRoutes.ts
│   │   └── ...
│   ├── sockets/             # WebSocket handlers
│   │   └── socket.ts
│   ├── types/               # TypeScript types
│   └── index.ts             # Server entry point
├── .env                     # Environment variables
├── tsconfig.json            # TypeScript config
└── package.json
```

## 🗄️ Database Schema

### Models & Relationships

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    Users    │     │    Calls    │     │    Tags     │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ id          │     │ id          │     │ id          │
│ username    │     │ name        │     │ name        │
│ password    │     │ createdAt   │     │ createdAt   │
│ email       │     │ updatedAt   │     │ updatedAt   │
│ role        │     └─────────────┘     └─────────────┘
│ createdAt   │            │                    │
│ updatedAt   │            │                    │
└─────────────┘            │                    │
                           │                    │
                    ┌──────┴──────┐      ┌──────┴──────┐
                    │  CallTags   │      │   TagTasks  │
                    ├─────────────┤      ├─────────────┤
                    │ callId      │      │ tagId       │
                    │ tagId       │      │ taskId      │
                    └─────────────┘      └─────────────┘
                           │                    │
                           │                    │
                    ┌──────┴──────┐      ┌──────┴──────┐
                    │  CallTasks  │      │    Tasks    │
                    ├─────────────┤      ├─────────────┤
                    │ callId      │      │ id          │
                    │ taskId      │      │ name        │
                    │ taskStatus  │      │ isSuggested │
                    └─────────────┘      └─────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database
- npm or yarn

### Installation

1. Navigate to server directory:
```bash
cd apps/server
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```env
# Database
DB_USER=postgres
DB_PASS=your_password
DB_NAME=cms_db
DB_HOST=localhost
DB_PORT=5432
DB_URL=postgresql://postgres:password@localhost:5432/cms_db

# JWT Secrets (generate secure random strings)
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Start the development server:
```bash
npm run dev
```

## 📡 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Create a new user (Admin only)
```json
{
  "username": "string",
  "email": "email",
  "password": "string",
  "role": "admin" | "user"
}
```

#### POST /api/auth/login
User login
```json
{
  "username": "string",
  "password": "string"
}
```
Returns: `{ token, refreshToken, user }`

#### POST /api/auth/refresh-token
Refresh access token
```json
{
  "refreshToken": "string"
}
```

#### GET /api/auth/me
Get current user (Protected)

### Call Management Endpoints

#### GET /api/calls
Get all calls (Protected)

#### POST /api/calls
Create a new call (Protected)
```json
{
  "name": "string"
}
```

#### GET /api/calls/:id
Get call by ID (Protected)

#### POST /api/calls/:callId/tags
Add tags to call (Protected)
```json
{
  "tagIds": [1, 2, 3]
}
```

#### GET /api/calls/:callId/tags
Get call tags (Protected)

#### GET /api/calls/:callId/tasks
Get call tasks (Protected)

#### POST /api/calls/:callId/tasks
Add task to call (Protected)
```json
{
  "taskId": 1,  // For suggested task
  "taskName": "string",  // For custom task
  "taskStatus": "Open"
}
```

#### PUT /api/calls/:callId/tasks/:taskId
Update task status (Protected)
```json
{
  "taskStatus": "Open" | "In Progress" | "Completed"
}
```

### Tag Management Endpoints

#### GET /api/tags
Get all tags (Protected)

#### POST /api/tags
Create tag (Admin only)
```json
{
  "name": "string"
}
```

#### PUT /api/tags/:id
Update tag (Admin only)
```json
{
  "name": "string"
}
```

#### GET /api/tags/:tagId/suggested-tasks
Get suggested tasks for tag (Protected)

#### POST /api/tags/:tagId/suggested-tasks
Link suggested task to tag (Admin only)
```json
{
  "taskId": 1
}
```

### Task Management Endpoints

#### GET /api/tasks/suggested
Get all suggested tasks (Protected)

#### POST /api/tasks/suggested
Create suggested task (Admin only)
```json
{
  "name": "string"
}
```

#### POST /api/tasks/suggested/by-tags
Get suggested tasks for multiple tags (Protected)
```json
{
  "tagIds": [1, 2, 3]
}
```

## 🔌 WebSocket Events

The server emits the following Socket.io events:

- `tag:created` - When a new tag is created
- `tag:updated` - When a tag is renamed
- `task:created` - When a new task is created
- `task:statusUpdated` - When task status changes
- `call:updated` - When call is modified

## 🔐 Authentication Flow

1. User logs in with credentials
2. Server validates and returns JWT + refresh token
3. Client includes JWT in Authorization header
4. Server validates JWT on protected routes
5. Client refreshes token when expired

### Middleware

- `authenticate` - Validates JWT token
- `requireAdmin` - Checks for admin role
- `errorMiddleware` - Centralized error handling

## 🧪 Development

### Available Scripts

- `npm run dev` - Start with hot reload (tsx watch)
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled JavaScript
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier

### Database Commands

```bash
# Create database
createdb cms_db

# Run migrations (automatic on server start)
# The server runs sequelize.sync() on startup
```

## 🚀 Deployment

### Environment Setup

1. Set production environment variables
2. Use secure JWT secrets (min 32 characters)
3. Configure production database
4. Set `NODE_ENV=production`

### Production Considerations

- Enable HTTPS
- Configure CORS for production domain
- Set up database backups
- Monitor error logs
- Rate limiting for API endpoints
- Database connection pooling

## 🔍 Error Handling

The server implements centralized error handling:

```typescript
// All errors are caught and formatted consistently
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error (development only)"
}
```

## 🐛 Debugging

- Check server logs for errors
- Verify database connection
- Test API endpoints with Postman
- Monitor WebSocket connections
- Check JWT token expiration

## 📊 Performance

- Database queries are optimized with includes
- Indexes on foreign keys
- Connection pooling enabled
- Efficient error handling
- Minimal middleware overhead

---

Built with Express + TypeScript + Sequelize
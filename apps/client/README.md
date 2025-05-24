# Cytactic Client - React Frontend

Modern, responsive React application for the Cytactic Call Management System.

## 🎨 Features

### User Interface
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Live synchronization across all connected clients
- **Modern UI**: Clean, professional interface with smooth animations
- **Toast Notifications**: User feedback for all actions
- **Loading States**: Loading component and progress indicators

### Role-Based Views
- **Admin Dashboard**: Tag and suggested task management
- **User Dashboard**: Call and task management interface
- **Dynamic Navigation**: Role-specific menu options

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management
- **RTK Query** - Data fetching and caching
- **React Router v7** - Client-side routing
- **Tailwind CSS v4** - Utility-first styling
- **Socket.io Client** - WebSocket connections
- **React Toastify** - Toast notifications
- **Vite** - Fast build tool and dev server

## 📁 Project Structure

```
apps/client/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button/
│   │   ├── Modal/
│   │   ├── Sidebar/
│   │   └── ...
│   ├── pages/              # Page components
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   └── AdminDashboard.tsx
│   ├── providers/              # Providers
│   │   └── AdminDashboard.tsx
│   ├── sockets/              # sockets
│   │   └── socket.ts
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.ts
│   │   └── useErrorHandler.ts
│   │   └── ...
│   ├── store/              # Redux store configuration
│   │   ├── api         # RTK Query API
│   │   ├── slices         # Auth Slice
│   │   └── store.ts
│   │   └── ...
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx            # Root component
│   └── main.tsx           # Application entry point
├── public/                 # Static assets
├── index.html
├── tailwind.config.js      # Tailwind configuration
├── vite.config.ts         # Vite configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- Running backend server

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_SERVER_URL=http://localhost:3000
VITE_NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

## 📱 Key Components

### Layout Components
- **AppContent**: Main application wrapper with routing
- **Navbar**: Navigation with role-based menu items
- **Container**: Page layout wrapper

### Feature Components
- **Sidebar**: Call list navigation
- **DetailContent**: Call details view
- **TagsSection**: Tag management interface
- **TasksSection**: Task list with status management
- **TaskItem**: Individual task with status dropdown

### Shared Components
- **Button**: Reusable button with loading states
- **Modal**: Flexible modal dialog
- **Input**: Styled form input
- **LoadingSpinner**: Loading indicator

## 🎯 Key Features Implementation

### Authentication Flow
1. JWT tokens stored in memory (not localStorage for security)
2. Automatic token refresh
3. Protected routes with role checking
4. Persistent login with refresh tokens

### State Management
- **RTK Query** for server state
- **Redux slices** for client state
- **Optimistic updates** for better UX
- **Cache invalidation** on mutations

### Real-time Features
- WebSocket connection for live updates
- Automatic reconnection on disconnect
- Event-based updates for tags and tasks

### Task Management
- Drag-and-drop task ordering (if implemented)
- Status updates with visual feedback
- Sorted by status: Open → In Progress → Completed
- Color-coded status indicators

## 🎨 Styling Guide

The application uses Tailwind CSS with a custom design system:

### Color Palette
- **Primary**: Blue-600 (#2563eb)
- **Success**: Green shades
- **Warning**: Yellow shades
- **Error**: Red shades
- **Neutral**: Gray shades

### Design Patterns
- Rounded corners (`rounded-lg`)
- Subtle shadows (`shadow-sm`)
- Hover effects with transitions
- Consistent spacing scale
- Responsive design

## 🔒 Security Considerations

- No sensitive data in localStorage
- HTTPS in production
- CORS configured
- Input validation on all forms

## 🐛 Debugging

### Development Tools
- React DevTools for component inspection
- Redux DevTools for state debugging
- Network tab for API monitoring
- Console for WebSocket events

### Common Issues
1. **CORS errors**: Check server CORS configuration
2. **WebSocket connection**: Ensure server is running
3. **Auth issues**: Check token expiration
4. **Build errors**: Clear node_modules and reinstall
4. **Build errors**: Run npm install only from monorepo root

## 📦 Building for Production

1. Build the application:
```bash
npm run build
```

2. The build output will be in `dist/` directory

3. Deploy to your hosting service

### Environment Variables
Remember to set production environment variables:
```env
VITE_SERVER_URL=https://your-api-domain.com
VITE_NODE_ENV=production
```

---
# Video Submission Dashboard 🎬

A beautiful, streamlined dashboard application for TikTok and Instagram video submissions. Built with clean architecture principles, premium design, and a focus on simplicity and user experience.

## ✨ Features

### For Creators
- **Simple Video Submission**: Paste TikTok or Instagram URLs with optional captions and hashtags
- **Submission History**: Track status (Pending, Approved, Rejected) with admin feedback
- **Clean Dashboard**: Joyful, distraction-free interface focused on content creation
- **Real-time Updates**: See submission status changes immediately

### For Admins  
- **Review Dashboard**: Manage all submissions with filtering and search
- **Quick Actions**: Approve or reject submissions with feedback in one click
- **Analytics**: View submission stats, most active creators, and trends
- **User Management**: Activate/deactivate creator accounts

## 🏗️ Architecture

Built following clean architecture and OOP principles:

- **Frontend**: React + TypeScript + Styled Components
- **Backend**: Node.js + Express + TypeScript + SQLite
- **Design**: Premium, minimal interface with semantic colors
- **Patterns**: Manager/Coordinator patterns, dependency injection, single responsibility

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd video-submission-dashboard
   npm run install:all
   ```

2. **Environment setup**
   ```bash
   # Backend environment
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or separately:
   npm run dev:frontend  # Frontend on :5173
   npm run dev:backend   # Backend on :3001
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001/api

## 📁 Project Structure

```
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/       # UI components by feature
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── creator/      # Creator dashboard components
│   │   │   ├── admin/        # Admin dashboard components
│   │   │   └── shared/       # Reusable UI components
│   │   ├── managers/         # Business logic managers
│   │   ├── coordinators/     # Application flow coordinators
│   │   ├── types/            # TypeScript type definitions
│   │   └── styles/           # Theme and global styles
│   └── package.json
├── backend/                  # Node.js Express API
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── managers/         # Business logic managers
│   │   ├── models/           # Data models
│   │   ├── routes/           # API route definitions
│   │   ├── middleware/       # Express middleware
│   │   └── utils/            # Utility functions
│   └── package.json
└── package.json              # Root package configuration
```

## 🎨 Design Philosophy

### Premium & Minimal
- **Clean Typography**: Inter font family for readability
- **Soft Color Palette**: Blues and neutrals for calm, professional feel
- **Generous Spacing**: Breathing room between elements
- **Subtle Animations**: Smooth transitions and micro-interactions

### User-Centric
- **Creator Joy**: Making video submission feel effortless and rewarding
- **Admin Efficiency**: Streamlined review process with clear actions
- **Mobile Responsive**: Works beautifully on all devices
- **Accessibility**: Focus states, semantic HTML, screen reader friendly

## 🔧 Development

### Code Standards
- **File Size**: Maximum 500 lines per file
- **Single Responsibility**: Each class/function has one clear purpose
- **OOP First**: Everything organized in classes with clear interfaces
- **Modular Design**: Components designed like Lego blocks for reusability

### Key Patterns
- **Manager Pattern**: Business logic (AuthManager, SubmissionManager)
- **Coordinator Pattern**: Application flow (AppCoordinator)
- **Repository Pattern**: Data access abstraction
- **Singleton Pattern**: Shared managers and coordinators

## 🔐 Security

- JWT authentication with secure token handling
- Password hashing with bcrypt
- Input validation with Joi
- CORS and Helmet security headers
- SQL injection prevention with prepared statements

## 📊 Database Schema

### Users Table
- Supports both Creator and Admin roles
- Creator-specific fields: isActive, submission counts
- Admin-specific fields: permissions array

### Submissions Table
- Video URL with platform detection
- Status tracking (pending → approved/rejected)
- Admin feedback system
- Comprehensive metadata (captions, hashtags, notes)

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
- `JWT_SECRET`: Strong secret key for JWT tokens
- `NODE_ENV`: Set to 'production'
- `PORT`: Server port (default: 3001)
- `FRONTEND_URL`: Frontend domain for CORS

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

### Submissions
- `POST /api/submissions` - Create submission (creators)
- `GET /api/submissions` - List submissions (filtered by role)
- `PUT /api/submissions/:id/review` - Review submission (admins)
- `GET /api/submissions/stats` - Analytics (admins)

### Users (Admin only)
- `GET /api/users` - List all users
- `PUT /api/users/:id` - Update user
- `POST /api/users/:id/activate` - Activate creator
- `POST /api/users/:id/deactivate` - Deactivate creator

## 🤝 Contributing

1. Follow the existing code patterns and file organization
2. Keep components under 200 lines, functions under 40 lines
3. Use descriptive names and clear interfaces
4. Write modular, testable code
5. Update documentation for new features

## 📄 License

MIT License - feel free to use this codebase for your own projects!

---

**Built with ❤️ focusing on clean architecture, premium design, and delightful user experience.**
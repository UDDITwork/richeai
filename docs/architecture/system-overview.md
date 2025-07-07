# RICHIEAT System Architecture Overview

## Technology Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS v4
- **State Management:** Context API (AuthContext)
- **Routing:** React Router v6
- **Form Handling:** React Hook Form
- **HTTP Client:** Axios with interceptors
- **Notifications:** React Hot Toast
- **Icons:** Lucide React

### Backend
- **Runtime:** Node.js with Express.js
- **Database:** MongoDB Atlas (Cloud)
- **ODM:** Mongoose with middleware hooks
- **Authentication:** JWT + bcrypt
- **Email Service:** Nodemailer with Gmail SMTP
- **Logging:** Winston + Morgan
- **Security:** CORS, helmet (to be added)

## System Architecture

### Client-Server Architecture
```
┌─────────────────────┐         ┌──────────────────────┐
│                     │         │                      │
│   React Frontend    │ <-----> │   Express Backend    │
│   (Port 5173)       │  HTTP   │   (Port 5000)        │
│                     │         │                      │
└─────────────────────┘         └──────────────────────┘
                                           │
                                           │ Mongoose
                                           ▼
                                ┌──────────────────────┐
                                │                      │
                                │   MongoDB Atlas      │
                                │   (Cloud Database)   │
                                │                      │
                                └──────────────────────┘
```

## Core Components

### 1. Authentication System
- **JWT-based authentication** with token storage in localStorage
- **Protected routes** using React Router and AuthContext
- **Middleware protection** on backend for API endpoints
- **Session management** with auto-logout on token expiry

### 2. User Management
- **Advisor Model:** SEBI-compliant fields, profile management
- **Client Model:** Comprehensive financial data structure
- **ClientInvitation Model:** Token-based invitation tracking

### 3. Email System
- **Gmail SMTP integration** for sending invitations
- **Token-based secure links** with expiry
- **Rate limiting:** 5 invitations per client email
- **Status tracking:** pending, sent, opened, completed

### 4. Logging Architecture
```
Winston Logger
├── Combined Log (all levels)
├── Error Log (errors only)
└── Console Output (development)

Morgan Middleware
├── HTTP Request logging
├── Response time tracking
└── Request metadata
```

### 5. API Structure
```
/api
├── /auth
│   ├── POST   /register
│   ├── POST   /login
│   ├── POST   /logout
│   ├── GET    /profile
│   └── PUT    /profile
└── /clients
    ├── /manage
    │   ├── GET    /         (list clients)
    │   ├── GET    /:id      (get client)
    │   ├── PUT    /:id      (update client)
    │   ├── DELETE /:id      (delete client)
    │   └── /invitations
    │       ├── GET  /       (list invitations)
    │       └── POST /       (send invitation)
    └── /onboarding
        ├── GET  /:token     (get form)
        └── POST /:token     (submit form)
```

## Security Measures

### Implemented
- **Password hashing** with bcrypt (10 rounds)
- **JWT tokens** with expiry (7 days)
- **CORS configuration** for specific origins
- **Environment variables** protection (.gitignore)
- **Input validation** on models and forms
- **SQL injection protection** via Mongoose
- **Rate limiting** on invitations

### Planned
- **Helmet.js** for security headers
- **API rate limiting** with express-rate-limit
- **Request sanitization** middleware
- **HTTPS enforcement** in production
- **2FA authentication** for advisors

## Data Flow

### Client Invitation Flow
1. Advisor sends invitation → Creates ClientInvitation record
2. Email sent with secure token → Client receives email
3. Client clicks link → Token validated, form loaded
4. Client submits form → Client record created
5. Invitation marked complete → Client appears in advisor's list

### Authentication Flow
1. Login with credentials → Validate against database
2. Generate JWT token → Send to client
3. Store token in localStorage → Include in API requests
4. Validate token on each request → Allow/deny access
5. Token expiry → Redirect to login

## Database Schema

### Collections
1. **advisors** - Financial advisor accounts
2. **clients** - Client profiles and data  
3. **clientinvitations** - Invitation tracking

### Indexes
- Email (unique) on advisors and clients
- Token (unique) on invitations
- Compound indexes for performance

## Deployment Considerations

### Frontend
- Build with Vite for production
- Static hosting (Netlify/Vercel)
- Environment-specific configs

### Backend
- Node.js hosting (Heroku/Railway)
- Environment variables in hosting
- MongoDB Atlas connection string

### Production Checklist
- [ ] Enable HTTPS
- [ ] Set secure CORS origins
- [ ] Configure production logging
- [ ] Enable MongoDB connection pooling
- [ ] Set up monitoring (PM2/New Relic)
- [ ] Configure email service limits
- [ ] Implement backup strategy
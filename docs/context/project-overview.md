# RICHIEAT - Project Overview

## Project Information
- **Project Name:** RICHIEAT
- **Type:** Financial Advisory Platform
- **Technology Stack:** React + Vite + Tailwind CSS + MongoDB + Express + Node.js
- **Target Users:** SEBI-registered financial advisors in India
- **Repository:** /home/rohan/richiai2/

## Project Structure
```
richiai2/
├── frontend/              # React Frontend (Vite)
├── backend/              # Node.js Backend (Express)
├── docs/                 # Project Documentation
│   ├── context/         # Project context files
│   ├── claude/          # AI conversation memory
│   ├── progress/        # Progress tracking
│   └── architecture/    # Technical architecture
└── README.md
```

## Core Features
1. **Advisor Registration**
   - Multi-step form with SEBI compliance
   - Professional details verification
   - Email verification

2. **Client Management**
   - Client invitation system
   - Onboarding workflow
   - Client list with search/filter

3. **Dashboard**
   - Statistics overview
   - Recent activities
   - Quick actions

4. **Profile Management**
   - Advisor profile editing
   - Document uploads
   - Settings configuration

## Technical Implementation
- **Frontend:** React 18 with Vite build tool
- **Styling:** Tailwind CSS utility-first approach
- **UI Components:** Shadcn/UI + Radix UI primitives
- **Component Variants:** Class Variance Authority (CVA)
- **State Management:** React Context API
- **Routing:** React Router v6
- **Forms:** React Hook Form
- **HTTP Client:** Axios
- **Backend:** Express.js with MongoDB
- **Authentication:** JWT tokens

## Current Status
- Environment setup completed
- MongoDB Atlas connection configured
- Tailwind CSS PostCSS configuration fixed
- Shadcn/UI library installed and configured
- Test button component created and working
- Documentation structure created

## Next Steps
1. Implement advisor registration flow
2. Build dashboard components
3. Create client management system
4. Add authentication middleware
5. Implement file upload functionality
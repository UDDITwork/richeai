# RICHIEAT Documentation

This directory contains all project documentation for the RICHIEAT financial advisory platform.

## Documentation Structure

### 📁 Context Files
- **`PRD.md`** - Complete Product Requirements Document
- **`context/project-overview.md`** - Project context and overview

### 📁 Claude Memory
- **`claude/session-memory.md`** - AI conversation memory for continuity

### 📁 Progress Tracking
- **`progress/project-progress.md`** - Current project progress and milestones
- **`progress/work-history.md`** - Detailed work session history

### 📁 Architecture
- *Future architecture documentation will be added here*

## Quick Reference

### Project Information
- **Name:** RICHIEAT
- **Type:** Financial Advisory Platform
- **Tech Stack:** React + Vite + Tailwind CSS + MongoDB + Express + Node.js
- **Target:** SEBI-registered financial advisors in India

### Current Status (75% Complete)
- Environment setup: ✅ Complete
- Documentation: ✅ Complete
- MongoDB connection: ✅ Configured with Atlas
- Tailwind CSS: ✅ Configured
- Authentication System: ✅ Complete (JWT + bcrypt)
- Dashboard: ✅ Complete with responsive design
- Client Management: ✅ Complete with email invitations
- Client Onboarding: ✅ Complete with secure forms
- Logging System: ✅ Complete (Winston + Morgan)
- MVC Architecture: ✅ Implemented

### Completed Features
1. ✅ Advisor registration and login
2. ✅ Protected routes with authentication
3. ✅ Dashboard with statistics
4. ✅ Advisor profile management
5. ✅ Client invitation system (Gmail SMTP)
6. ✅ Client onboarding forms
7. ✅ Client detail views
8. ✅ Comprehensive logging
9. ✅ Environment security (.gitignore)

### Next Steps
1. Fix remaining database operation errors
2. Add UI/UX enhancements (loading states, error boundaries)
3. Implement financial planning tools
4. Add document upload functionality
5. Create report generation features

## How to Use This Documentation

1. **New developers** - Start with `context/project-overview.md`
2. **Continuing work** - Check `progress/project-progress.md` for current status
3. **AI assistants** - Review `claude/session-memory.md` for context
4. **Detailed requirements** - Reference `PRD.md` for complete specifications

## Maintenance

This documentation is maintained alongside the codebase. Please update relevant files when:
- Completing major features
- Resolving issues
- Making architectural changes
- Adding new requirements
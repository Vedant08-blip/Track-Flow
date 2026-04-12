# TrackFlow Backend

Backend API for TrackFlow Agile Project Management Platform built with Node.js, Express.js, and MongoDB.

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# Start production server
npm start
```

## Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── userController.js    # User operations
│   ├── projectController.js # Project operations
│   ├── storyController.js   # Story operations
│   ├── teamController.js    # Team operations
│   ├── iterationController.js # Sprint/Iteration operations
│   ├── chatController.js    # Chat operations
│   └── commentController.js # Comment operations
├── models/
│   └── schemas.js           # MongoDB schema definitions
├── routes/
│   ├── userRoutes.js        # User endpoints
│   ├── projectRoutes.js     # Project endpoints
│   ├── storyRoutes.js       # Story endpoints
│   ├── teamRoutes.js        # Team endpoints
│   ├── iterationRoutes.js   # Sprint/Iteration endpoints
│   ├── chatRoutes.js        # Chat endpoints
│   ├── commentRoutes.js     # Comment endpoints
│   └── api-endpoints.js     # All API endpoint documentation
├── middleware/
│   ├── authMiddleware.js    # Authentication & authorization
│   ├── errorMiddleware.js   # Error handling
│   └── validationMiddleware.js # Input validation
├── services/
│   └── databaseService.js   # Business logic & database operations
├── utils/
│   ├── helpers.js           # Helper functions
│   ├── constants.js         # Application constants
│   └── logger.js            # Logging utility
├── .env.example             # Environment variables template
├── package.json             # Dependencies
└── server.js                # Main server file (to be created)
```

## Environment Variables

See `.env.example` for all required variables.

## API Endpoints

See `routes/api-endpoints.js` for complete API documentation.

## Main Features to Implement

- ✅ User Authentication (Register, Login, JWT)
- ✅ Project Management (CRUD)
- ✅ Story/Task Management (CRUD, Status updates)
- ✅ Team Management (Create, Add/Remove members)
- ✅ Sprint/Iteration Management (Planning, Tracking)
- ✅ Comments & Discussions
- ✅ Team Chat & Messaging
- ✅ Real-time Notifications (Optional)

## Database Models

- **User** - User profiles, authentication, skills
- **Project** - Projects, team assignments
- **Story** - User stories, task tracking
- **Team** - Team management, members
- **Iteration** - Sprint planning, velocity tracking
- **Comment** - Story comments, discussions
- **ChatMessage** - Team chat messages
- **Feature** - Epics and features

## Status

Backend structure is ready. Controllers, routes, and services need implementation.

## Next Steps

1. Implement server.js with Express setup
2. Implement database models with Mongoose
3. Implement controllers with business logic
4. Implement routes with endpoints
5. Add authentication & validation middleware
6. Add error handling
7. Test all endpoints

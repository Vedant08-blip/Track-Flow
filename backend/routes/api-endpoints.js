// User Routes
// GET /api/v1/users - Get all users
// GET /api/v1/users/:id - Get user by ID
// POST /api/v1/auth/register - Register new user
// POST /api/v1/auth/login - Login user
// PUT /api/v1/users/:id - Update user profile
// DELETE /api/v1/users/:id - Delete user

// Project Routes
// GET /api/v1/projects - Get all projects
// GET /api/v1/projects/:id - Get project by ID
// POST /api/v1/projects - Create new project
// PUT /api/v1/projects/:id - Update project
// DELETE /api/v1/projects/:id - Delete project

// Story Routes
// GET /api/v1/stories - Get all stories
// GET /api/v1/stories/:id - Get story by ID
// POST /api/v1/stories - Create new story
// PUT /api/v1/stories/:id - Update story
// DELETE /api/v1/stories/:id - Delete story
// PATCH /api/v1/stories/:id/status - Update story status
// PATCH /api/v1/stories/:id/assign - Assign story to user

// Sprint/Iteration Routes
// GET /api/v1/iterations - Get all iterations
// GET /api/v1/iterations/:id - Get iteration by ID
// POST /api/v1/iterations - Create new iteration
// PUT /api/v1/iterations/:id - Update iteration
// DELETE /api/v1/iterations/:id - Delete iteration
// PATCH /api/v1/iterations/:id/start - Start iteration
// PATCH /api/v1/iterations/:id/close - Close iteration

// Team Routes
// GET /api/v1/teams - Get all teams
// GET /api/v1/teams/:id - Get team by ID
// POST /api/v1/teams - Create new team
// PUT /api/v1/teams/:id - Update team
// DELETE /api/v1/teams/:id - Delete team
// POST /api/v1/teams/:id/members - Add team member
// DELETE /api/v1/teams/:id/members/:memberId - Remove team member

// Comment Routes
// POST /api/v1/stories/:storyId/comments - Create comment
// GET /api/v1/stories/:storyId/comments - Get story comments
// PUT /api/v1/comments/:id - Update comment
// DELETE /api/v1/comments/:id - Delete comment

// Chat Routes
// POST /api/v1/teams/:teamId/messages - Send chat message
// GET /api/v1/teams/:teamId/messages - Get team messages
// PUT /api/v1/messages/:id - Update message
// DELETE /api/v1/messages/:id - Delete message
// POST /api/v1/messages/:id/reactions - Add emoji reaction

// Feature/Epic Routes
// GET /api/v1/features - Get all features
// GET /api/v1/features/:id - Get feature by ID
// POST /api/v1/features - Create new feature
// PUT /api/v1/features/:id - Update feature
// DELETE /api/v1/features/:id - Delete feature

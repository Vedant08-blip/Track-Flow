// User Model Schema
const userSchema = {
  _id: 'ObjectId',
  email: 'string (unique, required)',
  password: 'string (hashed, required)',
  username: 'string (unique, required)',
  firstName: 'string',
  lastName: 'string',
  avatar: 'string (avatar ID from 7 avatars)',
  bio: 'string',
  experience: 'string (Beginner, Intermediate, Advanced, Expert)',
  skills: [
    {
      name: 'string',
      category: 'string (Frontend, Backend, Design, DevOps, QA)',
      proficiency: 'string (Beginner, Intermediate, Advanced, Expert)',
    },
  ],
  github: 'string (URL)',
  linkedin: 'string (URL)',
  role: 'string (admin, scrum-master, developer)',
  teams: '[ObjectId] (references to teams)',
  createdAt: 'Date',
  updatedAt: 'Date',
};

// Project Model Schema
const projectSchema = {
  _id: 'ObjectId',
  name: 'string (required)',
  description: 'string',
  owner: 'ObjectId (reference to user)',
  teams: '[ObjectId] (references to teams)',
  status: 'string (active, archived, closed)',
  startDate: 'Date',
  endDate: 'Date',
  createdAt: 'Date',
  updatedAt: 'Date',
};

// Iteration (Sprint) Model Schema
const iterationSchema = {
  _id: 'ObjectId',
  project: 'ObjectId (reference to project)',
  name: 'string (required)',
  description: 'string',
  startDate: 'Date',
  endDate: 'Date',
  status: 'string (planned, active, completed)',
  capacity: 'number',
  velocity: 'number (calculated)',
  stories: '[ObjectId] (references to stories)',
  createdAt: 'Date',
  updatedAt: 'Date',
};

// Story Model Schema
const storySchema = {
  _id: 'ObjectId',
  project: 'ObjectId (reference to project)',
  iteration: 'ObjectId (reference to iteration)',
  title: 'string (required)',
  description: 'string',
  storyPoints: 'number',
  priority: 'string (Low, Medium, High, Critical)',
  status: 'string (Defined, In Progress, Completed, Accepted)',
  assignee: 'ObjectId (reference to user)',
  team: 'ObjectId (reference to team)',
  skillsRequired: '[string]',
  comments: '[ObjectId] (references to comments)',
  createdAt: 'Date',
  updatedAt: 'Date',
};

// Team Model Schema
const teamSchema = {
  _id: 'ObjectId',
  name: 'string (required)',
  description: 'string',
  members: '[ObjectId] (references to users)',
  lead: 'ObjectId (reference to user)',
  projects: '[ObjectId] (references to projects)',
  createdAt: 'Date',
  updatedAt: 'Date',
};

// Comment Model Schema
const commentSchema = {
  _id: 'ObjectId',
  story: 'ObjectId (reference to story)',
  author: 'ObjectId (reference to user)',
  content: 'string (required)',
  mentions: '[ObjectId] (references to users)',
  createdAt: 'Date',
  updatedAt: 'Date',
};

// Chat Message Model Schema
const chatMessageSchema = {
  _id: 'ObjectId',
  team: 'ObjectId (reference to team)',
  sender: 'ObjectId (reference to user)',
  content: 'string (required)',
  attachment: 'string (optional file path)',
  reactions: '[{ user: ObjectId, emoji: string }]',
  createdAt: 'Date',
};

// Feature/Epic Model Schema
const featureSchema = {
  _id: 'ObjectId',
  project: 'ObjectId (reference to project)',
  name: 'string (required)',
  description: 'string',
  status: 'string (planned, in-progress, completed)',
  stories: '[ObjectId] (references to stories)',
  createdAt: 'Date',
  updatedAt: 'Date',
};

module.exports = {
  userSchema,
  projectSchema,
  iterationSchema,
  storySchema,
  teamSchema,
  commentSchema,
  chatMessageSchema,
  featureSchema,
};

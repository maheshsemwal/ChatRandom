# Random Chat App with WebSockets

A real-time chat application that randomly pairs users for private conversations, implemented with modern web technologies.

## Overview

This application provides a platform for users to engage in anonymous one-on-one conversations with randomly matched partners. It uses WebSockets for real-time communication and features a responsive UI built with React and Tailwind CSS.

## Features

- **Random User Pairing**: Users are automatically matched with random partners for private conversations
- **Real-time Messaging**: Instant message delivery powered by WebSockets
- **File Sharing**: Support for image and document uploads
- **User Authentication**: Secure login system for user identification
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Reconnection Handling**: Graceful handling of disconnections with ability to reconnect

## Tech Stack

### Backend
- **Node.js** with **Express**: For API endpoints and server logic
- **WebSockets (ws)**: For real-time bidirectional communication
- **Redis**: For managing user pairing and pub/sub messaging
- **Supabase**: For file storage and database operations
- **TypeScript**: For type-safe code

### Frontend
- **React**: UI library for building the user interface
- **TypeScript**: For type-safe code
- **Tailwind CSS**: For styling components
- **Shadcn UI**: Component library for consistent design
- **Vite**: Build tool for fast development

## Architecture

### Connection Flow
1. User logs in and is authenticated
2. WebSocket connection is established with the server
3. User is either:
   - Placed in a waiting queue if no other users are available
   - Paired with another waiting user for a private chat

### Messaging System
- Messages are sent through WebSockets
- Redis pub/sub channels facilitate communication between paired users
- Each chat room has a unique identifier

### File Sharing
- Files are uploaded to Supabase storage
- Signed URLs are generated for secure file access
- Supports images and other document types

## Project Structure

### Backend
- **src/index.ts**: Main entry point and WebSocket server setup
- **src/userManager.ts**: Handles user connections and pairing logic
- **src/config/**: Configuration for Redis and Supabase
- **src/controllers/**: Request handlers for REST endpoints
- **src/routes/**: API route definitions

### Frontend
- **src/pages/**: Main application pages (Landing, Login, Chat)
- **src/components/**: Reusable UI components
- **src/context/**: React context providers for state management
- **src/actions/**: API interaction functions
- **src/types/**: TypeScript type definitions

## Deployment

The application is designed for deployment on platforms like Render or Vercel:
- Backend: Deployed on a Node.js server with Redis support
- Frontend: Static site hosting with SPA routing support

## Future Enhancements

- End-to-end encryption for messages
- Group chat functionality
- Voice and video chat capabilities
- User preferences for pairing algorithm
- Message history persistence options

## Steps to Start Locally

### 1. Manual Setup

#### Prerequisites

- Node.js (v14+)
- Redis server
- Supabase account (for file storage)
- Git

#### 1. Clone the Repository
```bash
git clone https://github.com/maheshsemwal/chatRandom
cd chatRandom
```

#### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=3000
REDIS_URL=your_redis_url
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
SUPABASE_BUCKET=chatrandombucket
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

The backend server should start on port 3000 (or the port specified in your .env file).

#### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```
VITE_API_URL=http://localhost:3000
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend development server should start on http://localhost:5173.

#### 4. Testing the Application

1. Open your browser and navigate to http://localhost:5173
2. Create an account or log in
3. The application will automatically try to pair you with another user
4. To test with multiple users, open the application in another browser or an incognito window

#### Troubleshooting

- **WebSocket Connection Issues**: Ensure the backend server is running and the VITE_WS_URL in frontend .env points to the correct address
- **File Upload Problems**: Verify your Supabase credentials and bucket configuration
- **Redis Connection Errors**: Make sure Redis server is running and accessible

#### Development Commands

##### Backend
- `npm run dev`: Start development server with hot-reload
- `npm run build`: Build for production
- `npm start`: Start production server

##### Frontend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally

### 2. Docker Setup

#### Prerequisites

- Docker and Docker Compose installed on your system
- Git (to clone the repository)

#### Configuration

1. Clone the repository (if you haven't already):
   ```bash
   git clone https://github.com/maheshsemwal/chatRandom
   cd chat-appWithWebsockets
   ```

2. Create environment files:

   **Backend Environment:**
   ```bash
   # For Windows
   ren backend\.env.example .env

   
   # For Linux/Mac
   cp backend/.env.exmpale backend/.env
   ```

   Edit `backend/.env` with the following:
   ```
   PORT=3000
   REDIS_URL=redis://redis:6379
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   SUPABASE_BUCKET=chatrandombucket
   FRONTEND_URL=http://localhost:5173
   ```

   **Frontend Environment:**
   ```bash
   # For Windows
   ren frontend\.env.example .env
   
   # For Linux/Mac
   cp frontend/.env.example .env
   ```

   Edit `frontend/.env` with the following:
   ```
   VITE_API_URL=http://localhost:3000
   ```

#### Build and Run with Docker

1. Build and start the containers:
   ```bash
   docker-compose up -d
   ```

2. Verify containers are running:
   ```bash
   docker-compose ps
   ```

3. Access the application at http://localhost:5173

#### Docker Commands

- **Start containers:**
  ```bash
  docker-compose up -d
  ```

- **View logs:**
  ```bash
  # All services
  docker-compose logs -f
  
  # Specific service
  docker-compose logs -f backend
  ```

- **Stop containers:**
  ```bash
  docker-compose down
  ```

- **Rebuild containers after code changes:**
  ```bash
  docker-compose build
  ```

#### Troubleshooting Docker Setup

- **Connection Issues:** If you can't connect to the frontend, check that the Vite server in the Dockerfile is configured with `--host 0.0.0.0`
- **Port Conflicts:** Ensure ports 5173 and 3000 are not in use by other applications
- **Backend Errors:** Check logs with `docker-compose logs backend`
- **Frontend not loading:** Ensure the backend container is accessible, verify with `docker-compose logs frontend`
- **Redis Connection Errors:** The Redis URL in your backend .env should be `redis://redis:6379`

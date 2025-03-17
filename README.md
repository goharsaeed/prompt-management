# Prompt Management System

## Overview
The **Prompt Management System** is a web-based application designed to streamline the assignment and evaluation of code and other task-based prompts to a distributed AI + human workforce. It allows admins to create, assign, and review prompts while enabling users to track their assignments, submit work, and receive feedback.

## Features
### Admin Capabilities
- **User Registration & Authentication**: Secure login and role-based access (Admin/User).
- **Prompt Creation & Management**: Admins can create prompts with details such as title, objectives, descriptions, and file attachments.
- **Assignment & Deadlines**: Admins can assign prompts to selected users with deadlines.
- **Submission Review & Feedback**: Admins can view all submissions, provide ratings, comments, and feedback.

### User Capabilities
- **Prompt Visibility**: Users can view assigned prompts on their dashboard.
- **Status Updates & Clarifications**: Users can provide status updates, request clarifications, and identify blockers.
- **Submission Process**: Users can submit responses including files, code snippets, or repository links.
- **Feedback & Iteration**: Users receive admin feedback to refine their submissions.

## Tech Stack
### Backend
- **Express.js**: API backend framework
- **Supabase**: PostgreSQL-based database for user authentication, prompt storage, and submission handling
- **AWS S3 (or equivalent)**: File storage solution for attachments and submissions

### Frontend
- **React.js**: Frontend framework for UI
- **Tailwind CSS**: Styling framework for enhanced UI/UX
- **Axios**: API communication between frontend and backend

### Authentication & Security
- **Supabase Auth**: Handles user registration and authentication
- **JWT (JSON Web Token)**: Used for secure API authentication

## Installation & Setup
### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+)
- **npm** or **yarn**
- **Supabase account** (for database and authentication setup)
- **AWS S3 or equivalent storage** (for file uploads)

### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/prompt-management-system.git
   cd prompt-management-system/backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a **.env** file and configure the following variables:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret
   S3_BUCKET=your_s3_bucket_name
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a **.env** file and configure the frontend:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   ```
4. Start the frontend server:
   ```sh
   npm start
   ```

### Database Setup (Supabase)
1. Create a new Supabase project.
2. Set up authentication (Enable email sign-in under "Authentication").
3. Create tables for **Users**, **Prompts**, **Assignments**, and **Submissions**.

## API Endpoints
### Authentication
- **POST /auth/register** - User Registration
- **POST /auth/login** - User Login

### Admin Actions
- **POST /prompts** - Create a new prompt
- **GET /users** - Retrieve all users
- **POST /assign** - Assign a prompt to users
- **GET /submissions** - View all submissions
- **POST /submissions/review** - Submit feedback

### User Actions
- **GET /dashboard** - Fetch assigned prompts
- **POST /prompts/:id/submit** - Submit prompt response

## Deployment
- **Frontend:** Vercel, Netlify, or any static hosting provider
- **Backend:** Heroku, AWS, or DigitalOcean
- **Database:** Supabase (Managed PostgreSQL)

## Future Enhancements
- **Real-time collaboration**: Chat between users and admins
- **Advanced AI evaluations**: AI-assisted feedback on submissions
- **Admin analytics dashboard**: Insights on prompt progress and user performance

## License
This project is licensed under the MIT License.

# 01Blog

A full-stack blogging platform with Angular frontend and Spring Boot backend, featuring user authentication, post creation with media uploads, social interactions (likes, comments, follows), notifications, and admin moderation tools.

## Architecture

- **Frontend**: Angular 20 with standalone components, signals, HttpClient, routing, and Bootstrap styling.
- **Backend**: Spring Boot with REST APIs, JWT authentication, PostgreSQL database, and file upload handling.
- **Security**: JWT-based auth with role-based access (ADMIN_USER, N_USER).
- **Database**: PostgreSQL with JPA entities for users, posts, comments, likes, notifications, subscriptions, and reports.
- **File Handling**: Local storage for media (images/videos) up to 100MB.

## File Structure

```
01blog-bbenskou/
├── client_side/
│   └── blog/
│       ├── src/
│       │   └── app/
│       │       ├── admin/          # Admin dashboard components
│       │       ├── guards/         # Route guards (admin, token validation)
│       │       ├── home/           # Home feed component
│       │       ├── login/          # Login component
│       │       ├── newpost/        # New post creation component
│       │       ├── notification/   # Notifications component
│       │       ├── profile/        # User profile component
│       │       ├── register/       # Registration component
│       │       ├── sevice/         # Angular services (auth, post, admin, etc.)
│       │       ├── shared/         # Shared components (nav-bar, posts, feedback)
│       │       ├── singlepost/     # Single post view component
│       │       └── app.*           # Main app files (config, routes, etc.)
│       ├── public/                 # Static assets (favicon, avatar)
│       └── angular.json, package.json, etc.
├── server_side/
│   └── blog/
│       ├── src/main/java/com/blog/
│       │   ├── admin/              # Admin controllers and services
│       │   ├── auth/               # Auth controllers and services
│       │   ├── comment/            # Comment controllers and services
│       │   ├── common/             # Common utilities (exceptions, responses)
│       │   ├── config/             # Security config, JWT service
│       │   ├── Likes/              # Like controllers and services
│       │   ├── notification/       # Notification controllers and services
│       │   ├── post/               # Post controllers and services
│       │   ├── report/             # Report controllers and services
│       │   ├── subscription/       # Subscription controllers and services
│       │   └── user/               # User controllers and services
│       ├── src/main/resources/
│       │   └── application.properties  # DB config, JWT settings
│       └── uploads/                # Media files storage
└── package-lock.json, README.md
```

## Backend Endpoints

All endpoints are prefixed with `/api`. Protected endpoints require `Authorization: Bearer <token>` header.

### Auth Endpoints
- `POST /auth/register` - Register new user (multipart with avatar)
- `POST /auth/login` - Login and get JWT
- `POST /auth/verifytoken` - Verify JWT validity

### Post Endpoints
- `POST /post/createpost` - Create new post (multipart with media)
- `GET /post/profile/{username}` - Get user's posts (paginated: ?page=0&size=10)
- `PUT /post/{postId}` - Update post (multipart)
- `DELETE /post/{postId}` - Delete post
- `GET /post/home` - Get home feed (posts from followed users, paginated)
- `GET /post/{postId}` - Get single post details

### Comment Endpoints
- `GET /comments/{postId}` - Get comments for post (paginated)
- `POST /comments` - Add comment
- `PUT /comments/{id}` - Update comment
- `DELETE /comments/{id}` - Delete comment

### Like Endpoints
- `POST /likes` - Toggle like on post

### Notification Endpoints
- `GET /notifications` - Get user notifications (paginated: ?page=0&size=5)
- `PUT /notifications/{id}/read` - Mark notification as read

### Subscription Endpoints
- `POST /subscriptions` - Follow user
- `DELETE /subscriptions/{id}` - Unfollow user
- `GET /subscriptions/following` - Get following list
- `GET /subscriptions/followers` - Get followers list

### User Endpoints
- `GET /users/me` - Get current user info
- `PUT /users/me` - Update profile (multipart with avatar)

### Report Endpoints
- `POST /reports` - Report post
- `POST /profile-reports` - Report user profile

### Admin Endpoints (Require ADMIN_USER role)
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/users` - List users (paginated)
- `PUT /admin/users/{id}/ban` - Ban/unban user
- `DELETE /admin/users/{id}` - Delete user
- `GET /admin/posts` - List posts (paginated)
- `PUT /admin/posts/{id}/hide` - Hide/unhide post
- `DELETE /admin/posts/{id}` - Delete post
- `GET /admin/reports` - List post reports
- `PUT /admin/reports/{id}/resolve` - Resolve post report
- `GET /admin/profile-reports` - List profile reports
- `PUT /admin/profile-reports/{id}/resolve` - Resolve profile report

## Frontend Routes

- `/` - Home feed (protected, requires token)
- `/login` - Login page
- `/register` - Registration page
- `/newpost` - Create new post (protected)
- `/post/:id` - Single post view (protected)
- `/profile/:username` - User profile (protected)
- `/notification` - Notifications (protected)
- `/admin` - Admin dashboard (protected, requires admin role)
- `**` - Wildcard redirects to home

## Quick Start

### Backend
```bash
cd server_side/blog
./mvnw spring-boot:run
```
Runs on `http://localhost:8080`.

### Frontend
```bash
cd client_side/blog
ng s
```
Runs on `http://localhost:4200`.


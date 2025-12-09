📝 01Blog — Fullstack Social Blogging Platform

A fullstack project built with Java Spring Boot & Angular

🚀 Overview

01Blog is a social blogging platform designed for students to share their learning journey, discoveries, and progress.
The application allows users to publish posts, interact with content, follow profiles, and report inappropriate behavior — with administrators managing moderation and platform safety.

This project demonstrates fullstack development skills using Spring Boot for the backend and Angular for the frontend, covering authentication, REST APIs, content management, and UI/UX.

🎯 Features
👤 Authentication & Users

User registration & login (secure password handling)

JWT or Spring Security–based authentication

Role-based access (USER / ADMIN)

User public profile ("Block") with all their posts

Subscribe/unsubscribe to other users

Notification system for new posts

📝 Posts

Create, edit, and delete blog posts

Upload images/videos with preview

Likes & comments (live or refreshed)

Timestamps, media preview, and interaction counters

🚨 Reports & Moderation

Users can report other profiles with a reason

Reports are visible only to admins

Admin actions: ban/delete users, delete posts, manage reports

🛠 Admin Panel

View all users, posts, and reports

Manage users (ban, delete, role control)

Clean UI for moderation tasks

💬 Frontend UX

Feed showing posts from subscribed users

Personal block page (user’s posts management)

View other profiles + subscribe/unsubscribe

Notification icon with unread counters

Responsive UI using Angular Material or Bootstrap

🧱 Technology Stack
🔗 Backend (Java Spring Boot)

Spring Boot (Web, Security, JPA)

JWT

Relational DB: PostgreSQL 

File Upload (local storage )

JPA/Hibernate for ORM

🌐 Frontend (Angular)

Angular 15+

Angular Routing

Angular Services (API integration)

Bootstrap

Reactive Forms

🗄 Database

PostgreSQL / MySQL

Tables for: Users, Posts, Likes, Comments, Subscriptions, Reports, Notifications

📁 Project Structure
```
01Blog/
├── backend/
│   ├── src/main/java/... (controllers, services, entities, security)
│   ├── src/main/resources/application.properties
│   └── pom.xml
│
└── frontend/
    ├── src/app/components
    ├── src/app/services
    ├── src/app/pages
    ├── src/app/modules
    └── angular.json
```
⚙️ How to Run the Project
🟦 Backend — Spring Boot
1️⃣ Configure environment

Update application.properties:
```
spring.datasource.url=jdbc:postgresql://localhost:5432/01blog
spring.datasource.username=yourUser
spring.datasource.password=yourPassword
spring.jpa.hibernate.ddl-auto=update
jwt.secret=yourSecretKey
```
2️⃣ Run backend
```
cd backend
mvn spring-boot:run

```
Backend will run on:
📌 http://localhost:8080

🟩 Frontend — Angular
1️⃣ Install dependencies
```
cd frontend
npm install
```
2️⃣ Run the Angular app
```
ng serve --open

```
Frontend will run on:
📌 http://localhost:4200

🔐 Security

The project uses:

JWT authentication or Spring Security sessions

Role-based routing (USER vs ADMIN)

Protected endpoints following REST best practices

🧪 API Endpoints (Sample)
```
POST /auth/register
POST /auth/login
GET  /users/{id}
POST /posts
GET  /posts/feed
POST /posts/{id}/like
POST /posts/{id}/comment
POST /reports/{userId})
```
🧩 Learning Objectives Covered

Spring Boot REST API architecture

Secure authentication using Spring Security / JWT

Angular components, services, routing, UI design

Handling user-generated content & media uploads

Database modeling for social networks

Admin moderation workflows

Git & GitHub collaboration



📄 License

This project is for educational purposes. Add a license if needed.

💬 Final Notes

This project reflects fullstack development skills from backend API design to frontend UX, including authentication, media handling, and content moderation.

If you have ideas to improve this project, feel free to open an issue or contribute!

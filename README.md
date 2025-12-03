# 01Blog

A full-stack blogging platform built with **Spring Boot** on the server side and **Angular 17** on the client side.  
This README doubles as a mini crash course so you can revisit the core concepts (Spring, Angular, JWT auth, etc.) and understand how the pieces of the application fit together.

---

## 1. Architecture at a Glance

```
┌──────────────┐        JWT + JSON           ┌─────────────────────┐
│   Angular    │  ───────────────────────▶  │  Spring Boot REST   │
│   Frontend   │  ◀───────────────────────  │     Controllers     │
└──────┬───────┘                            ├───────────┬─────────┤
       │                                   │Services   │Filters  │
       │ HTTP (fetch)                      └────┬──────┴────┬────┘
       ▼                                        │           │
┌──────────────┐    JPA/Hibernate               │           │
│    Browser   │ ───────────────────────────▶  │    MySQL / JPA
└──────────────┘                                │(entities, repos)
                                           ┌────▼──────┐
                                           │Database   │
                                           └───────────┘
```

- **Angular**: Standalone components, HttpClient, routing, Bootstrap styling.
- **Spring Boot**: REST controllers, services, repositories, security, JWT auth, validation.
- **Shared JWT**: Stored in `localStorage`; attached as `Authorization: Bearer <token>` for protected endpoints.
- **Database**: via Spring Data JPA repositories (e.g., `PostRepository`, `UserRepository`, `ReportRepository`).

---

## 2. Quick Start

### Backend (Spring Boot)
```bash
cd server_side/blog
./mvnw spring-boot:run
```
By default the API listens on `http://localhost:8080`.

### Frontend (Angular)
```bash
cd client_side/blog
npm install
npm start      # serves at http://localhost:4200
```

> Tip: run both servers in parallel so the Angular app can talk to the API.

---

## 3. Spring Boot Primer

| Concept | Where to look | Why it matters |
| - | - | - |
| **Controllers** | `/server_side/blog/src/main/java/com/blog/.../controller` | Map HTTP routes to Java methods (`@GetMapping`, `@PostMapping`). Return JSON via `ResponseEntity`. |
| **Services** | `.../service/` | Business logic layer. Keeps controllers thin. Example: `NotificationService` computes pagination, `AdminReportService` aggregates dashboard data. |
| **Repositories** | `.../repository/` | Spring Data JPA interfaces (`extends JpaRepository`). Free CRUD + derived queries (`findByUserIdOrderByCreatedAtDesc`). |
| **Entities/DTOs** | `.../model/` + `.../dto/` | Entities map tables; DTOs shape responses (`PostResponseDto`, `DashboardStatsDTO`). |
| **Security** | `SecurityConfig`, `JwtAuthenticationFilter`, `CustomUserDetailsService` | Validates JWT, injects authenticated user info, rejects disabled users. |

### Typical request flow
1. Angular calls `/api/admin/posts` with JWT.
2. `JwtAuthenticationFilter` parses token, loads user, ensures `enabled=true`.
3. Controller delegates to service.
4. Service uses repository (JPA) for DB query.
5. Response serialized to JSON and sent back.

---

## 4. Angular Primer

| Concept | Where to look | Notes |
| - | - | - |
| **Standalone components** | `/client_side/blog/src/app/.../*.ts` | Components import needed modules themselves (e.g., `Admin`, `Notification`, `Singlepost`). |
| **Routing** | `app.routes.ts` | Maps URLs to components. Admin route protected via `adminGuard`. |
| **HttpClient** | `NotificationService`, `AdminService`, inline calls in components | Use `HttpClient` to call backend. Headers include JWT (from `localStorage`). |
| **Reactive patterns** | Basic Observables from `HttpClient` | `subscribe({ next, error })` used to update UI state. |
| **Bootstrap styling** | `admin.css`, `notification.css`, `singlepost.css` | Layout via Bootstrap classes plus custom CSS. |

### UI data flow example (Notifications)
1. Component loads auth headers via helper.
2. Calls backend `/api/notifications?page=0&size=5`.
3. Stores `content`, `totalPages`, `hasMore`.
4. `Show more` appends next page.
5. Clicking a notification marks it as read via PUT and routes to the post.

---

## 5. Feature Breakdown (Back ↔ Front)

| Feature | Backend | Frontend |
| - | - | - |
| **Auth (login/register)** | `AuthController`, `UserService`, JWT generation, `CustomUserDetailsService` toggles `enabled`. | `login.ts` stores token; guard ensures only admins hit `/admin`. |
| **Posts** | `PostController` (not listed above but available), `PostService`, `PostRepository`. Entities store media URLs + content. | `Singlepost` component, `NewPost` component for create/edit; `PostService` (Angular) handles API. |
| **Likes/Comments** | `LikeService`, `Comment` endpoints. | Buttons in `Singlepost` send POST/DELETE; comment list paginated. |
| **Notifications** | `NotificationController`, pageable repository (`Page<Notification>`). | Notification component lazy-loads, "Show more" fetch. |
| **Reports** | `ReportController` (post reports), `ProfileReportController`. `AdminReportService` aggregates data for dashboard. | `Admin` dashboard shows post reports and profile reports with actions (resolve, hide, delete). |
| **Admin moderation** | `/api/admin/...` controllers + guard. Handles banning, hiding posts, summarizing stats. | Admin UI displays stats cards, tables, modals for ban/hide/report resolution. |

---

## 6. Data & Schema Highlights

### Users
- Fields: `id`, `username`, `email`, `password`, `role`, `enabled`, etc.
- Repositories provide `findByUsername`, `countByEnabled`.
- `enabled=false` = banned; enforced both at login and JWT filter.

### Posts
- `Post` has `List<String> media`, `content`, `enabled`, timestamps.
- `PostResponseDto` used to send extra info such as `likedByUser`, `ismy`.

### Notifications
- `Notification` entity with `message`, `postId`, `user`, `isRead`, `createdAt`.
- Pageable repository for "Show more".

### Reports
- Post reports (`Report`, `ReportDTO`) & profile reports (`ProfileReport`, `ProfileReportDto`).
- Admin dashboard aggregates counts and lists for moderation.

---

## 7. Extending the Project

1. **New API Endpoint**  
   - Define DTO or entity if necessary.  
   - Add method to repository.  
   - Implement service method (with validation, business logic).  
   - Expose via controller method with mapping, security annotations.  

2. **New Angular Feature**  
   - Create a standalone component or extend existing one.  
   - Use `HttpClient` to call backend, handle `subscribe`.  
   - Update routing & guard if needed.  
   - Add styling through component-specific CSS.  

3. **Testing**  
   - Backend: use `./mvnw test`.  
   - Frontend: `ng test`.  
   - End-to-end: consider Cypress/Playwright (not configured yet).

---

## 8. Useful Commands & Resources

| Task | Command |
| - | - |
| Backend tests | `cd server_side/blog && ./mvnw test` |
| Frontend serve | `cd client_side/blog && npm start` |
| Generate Spring Boot package | `./mvnw clean package` |
| Analyze Angular bundle | `ng build --configuration production` |

### Learn more
- [Spring Boot Docs](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Security + JWT Guide](https://spring.io/guides/tutorials/spring-boot-oauth2/)
- [Angular Standalone Components](https://angular.dev/guide/standalone-components)
- [Angular HttpClient Guide](https://angular.dev/guide/http)

---

Happy hacking! Keep this README handy as both a project map and a quick refresher on the frameworks involved. Feel free to expand it with additional diagrams or troubleshooting notes as the app grows. 🛠️

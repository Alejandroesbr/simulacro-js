## Simulacro JS

Single Page Application built with vanilla JavaScript, Vite, Tailwind CSS and JSON Server. The app simulates a small project management system with authentication, protected routes, role-based permissions and CRUD operations.

## Business Goal

The application allows users to sign in and review project information according to their role:

- `manager`: can view and manage all projects.
- `collaborator`: can view only the projects assigned to their user.

This matches a common business scenario where different users need access to the same data module, but with different permissions.

## Tech Stack

- Vanilla JavaScript with ES modules
- Vite
- Tailwind CSS
- JSON Server
- Local Storage for session persistence
- Hash-based SPA routing

## Test Users

```txt
manager@test.com       / 123456
collaborator@test.com  / 123456
```

## Scripts

Install dependencies:

```bash
npm install
```

Run only the frontend:

```bash
npm run dev
```

Run only the API:

```bash
npm run api
```

Run frontend and API together:

```bash
npm run dev:full
```

Default URLs:

```txt
Frontend: http://localhost:5173
API:      http://localhost:3000
```

## Main Routes

```txt
#/login
#/dashboard
#/projects
#/projects/new
#/projects/edit/:id
```

Protected routes require an active session. Project creation, edition and deletion are restricted to `manager`.

## Project Structure

```txt
src/
  api/
    api.js
  core/
    guards.js
    router.js
    store.js
  modules/
    auth/
    dashboard/
    projects/
  shared/
    dom.js
    loader.js
    navbar.js
    toast.js
    validators.js
```

## Architecture

The project is divided by responsibility:

- `api`: centralizes HTTP requests to JSON Server.
- `core`: contains global state, route handling and route guards.
- `modules/auth`: manages login, logout and session persistence.
- `modules/projects`: manages project CRUD operations and role-based project filtering.
- `shared`: contains reusable UI and utility functions.

This separation keeps the SPA easier to understand, test and explain during the presentation.

## Data Flow

1. `main.js` restores the session from Local Storage and starts the router.
2. `router.js` reads the current hash route and renders the correct view.
3. `guards.js` checks whether the user is authenticated and allowed to access a route.
4. `auth.service.js` validates login credentials against `/users`.
5. `project.service.js` performs CRUD operations against `/projects`.
6. `project.store.js` stores projects in memory and filters them by role.
7. Views render dynamic HTML and bind DOM events after each render.

## Validation

The application includes reusable validators:

- `required()`
- `email()`
- `minLength()`
- `maxLength()`
- `oneOf()`

They are used in login and project forms to prevent empty fields, invalid emails, invalid status values, non-existing assigned users and inconsistent text lengths.

## Error Handling

The API wrapper handles:

- unavailable API server
- failed HTTP responses
- empty responses
- JSON parsing for valid responses

The UI displays global feedback through toast notifications and uses a loader during async operations.

## Session Persistence

The session is stored in Local Storage using a fixed key. On every app start, the session is restored and validated. If the stored data is invalid or corrupted, it is removed automatically.

## DOM Interaction

The SPA updates the DOM dynamically after route changes and form actions. Event listeners are attached after rendering each view. Dynamic text from users and projects is escaped before being inserted into HTML to reduce the risk of rendering unwanted markup.

## Rubric Coverage

- SPA and CRUDs: hash-based SPA with project create, read, update and delete.
- Session persistence: Local Storage session restored on reload.
- DOM interaction: dynamic rendering, form events, buttons, route changes and feedback UI.
- Authentication and protected routes: login, logout, authenticated routes and role-based guards.
- Presentation: code is separated by responsibility and can be explained by module.
- Documentation: this README describes the business goal, technical decisions, routes, scripts and data flow.

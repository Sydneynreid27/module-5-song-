# Module 5 Song App

This project now includes:
- Static frontend hosting from Express
- User signup and login with JWT tokens
- Password hashing with bcryptjs
- Token status checking via request headers
- Song creation and deletion by selected song ID
- MongoDB models for users and songs
- Deployment-safe `process.env.PORT` usage

## Run Locally

1. Install dependencies:
   npm install
2. Copy environment variables:
   cp .env.example .env
3. Add your values in `.env`:
   - `MONGO_URI`
   - `JWT_SECRET`
4. Start server:
   npm start

If `MONGO_URI` is missing or invalid, the app runs in memory mode for demo use.

## API Endpoints

- `POST /users`
  - body: `{ "username": "name", "password": "pw", "status": 1 }`
- `POST /auth`
  - body: `{ "username": "name", "password": "pw" }`
  - returns: `{ "username2": "name", "token": "...", "auth": 1 }`
- `GET /status`
  - header: `x-auth: <jwt token>`
- `GET /api/songs`
- `POST /api/songs`
  - body: `{ "title": "...", "artist": "...", "username": "..." }`
- `DELETE /api/songs/:id`

Legacy redirects are preserved for `/songs`, `/hello`, and `/goodbye`.

## Frontend Pages

- `/` public song list
- `/login.html` signup + login
- `/manage.html` protected page with add/delete song UI

The delete workflow uses a dropdown and grabs the selected value with `option:checked`.

## Authentication vs Authorization

- Authentication: verifies who the user is (username/password).
- Authorization: controls what a verified user is allowed to do.

This app authenticates with `/auth`, stores a JWT in local storage, and checks it with `/status`.

## Deploying to Render

1. Push this repo to GitHub.
2. In Render, create a new Web Service and connect the repo.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables in Render:
   - `PORT` (Render usually provides this automatically)
   - `MONGO_URI`
   - `JWT_SECRET`
6. Deploy.

Because the server binds with `process.env.PORT || 3000`, it runs both locally and on third-party hosts.

## Deploying to Replit

1. Import project from GitHub.
2. Set environment variables in Replit Secrets:
   - `MONGO_URI`
   - `JWT_SECRET`
3. Run with `npm start`.

Replit also provides a dynamic port, so `process.env.PORT` support is required.

# Subscription Tracker

A backend REST API for managing recurring subscriptions and automating renewal reminders. Users can register, add their subscriptions, and receive automated email notifications at 1, 2, 5, and 7 days before each renewal date.

🔗 **Repository**: https://github.com/bahaa-aldein/Subscription-Tracker

---

## Features

- **Subscription management** — full CRUD for subscriptions with multi-currency support (USD, EUR, EGP) and multiple frequencies (daily, weekly, monthly, yearly)
- **Automated reminders** — Upstash Workflow schedules and dispatches personalized HTML emails before each renewal
- **Authentication** — JWT authentication and bcrypt password hashing; subscription and user routes require a signed-in user and only return that user's own data
- **Security** — Arcjet rate limiting, bot protection and shield; Zod validation on subscription create and update

---

## Tech stack

**Runtime & framework**
Node.js · TypeScript · Express.js

**Database & ORM**
PostgreSQL · Prisma

**Auth & security**
JWT · bcrypt · Arcjet · Zod

**Workflows & notifications**
Upstash Workflow · Nodemailer

**Tooling**
ESLint · TypeScript

---

## Architecture

```
Request → Express Router
            ↓
        Middleware (Arcjet rate limiting, JWT auth)
            ↓
        Controller (Zod validation, business logic)
            ↓
        Prisma ORM → PostgreSQL
            ↓
        Upstash Workflow → Nodemailer (email reminders)
```

---

## API endpoints

**Auth**
- `POST /auth/sign-up` — register
- `POST /auth/sign-in` — login
- `POST /auth/sign-out` — logout

**Subscriptions** (all require `Authorization: Bearer <token>`)
- `GET /subscriptions` — list your subscriptions
- `GET /subscriptions/upcoming-renewals` — your active subscriptions with a future renewal date
- `GET /subscriptions/user/:id` — your subscriptions (`:id` must be your user id)
- `GET /subscriptions/:id` — get one
- `POST /subscriptions` — create (starts the reminder workflow)
- `PUT /subscriptions/:id` — update
- `DELETE /subscriptions/:id` — delete
- `PUT /subscriptions/:id/cancel` — cancel

**Users** (require a token; you can only access your own account)
- `GET /users/:id` — get profile
- `PUT /users/:id` — update name or email
- `DELETE /users/:id` — delete account

**Workflows**
- `POST /workflows/subscription/reminder` — called by Upstash Workflow, not by clients

---

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL instance
- Upstash account (Workflow)
- Gmail account with an App Password (used by Nodemailer)

### Installation

```bash
git clone https://github.com/bahaa-aldein/Subscription-Tracker.git
cd Subscription-Tracker
npm install
```

### Environment variables

Create a `.env.development` file in the root directory (the app loads `.env.${NODE_ENV}` and defaults to `development`):

```env
# Server
PORT=3000
SERVER_URL=http://localhost:3000

# Database
DATABASE_URL=

# Auth (both required; the app will not start without them)
JWT_SECRET=
JWT_REFRESH_SECRET=

# Upstash Workflow
QSTASH_URL=
QSTASH_TOKEN=

# Email (Gmail via Nodemailer)
GMAIL_USER=
GMAIL_APP_PASS=

# Arcjet
ARCJET_KEY=
ARCJET_ENV=development
```

### Set up the database

```bash
npx prisma generate
npx prisma db push
```

### Run locally

```bash
npm run dev
```

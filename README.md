# Subscription Tracker

A backend REST API for managing recurring subscriptions and automating renewal reminders. Users can register, add their subscriptions, and receive automated email notifications at 1, 2, 5, and 7 days before each renewal date.

🔗 **Repository**: https://github.com/bahaa-aldein/Subscription-Tracker

---

## Features

- **Subscription management** — full CRUD for subscriptions with multi-currency support (USD, EUR, EGP) and multiple frequencies (daily, weekly, monthly, yearly)
- **Automated reminders** — Upstash Workflow schedules and dispatches personalized HTML emails before each renewal; 100% timely delivery in production
- **Authentication** — JWT-based stateless auth with access/refresh tokens and bcrypt password hashing
- **Security** — Arcjet rate limiting and bot protection, Zod runtime schema validation on all inputs, zero critical vulnerabilities in production
- **CI/CD** — GitHub Actions pipeline automating linting, type checking, and tests on every pull request; reduced deployment time by 50%

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

**DevOps**
GitHub Actions · ESLint

---

## Architecture

```
Request → Express Router
            ↓
        Middleware (JWT auth, rate limiting, Zod validation)
            ↓
        Controller (business logic)
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

**Subscriptions**
- `GET /subscriptions` — list all
- `GET /subscriptions/:id` — get one
- `POST /subscriptions` — create
- `PUT /subscriptions/:id` — update
- `DELETE /subscriptions/:id` — delete
- `PUT /subscriptions/:id/cancel` — cancel
- `GET /subscriptions/user/:id` — user's subscriptions
- `GET /subscriptions/upcoming-renewals` — upcoming renewals

**Users**
- `GET /users/:id` — get profile
- `PUT /users/:id` — update profile

---

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL instance
- Upstash account (Workflow)
- Email SMTP credentials

### Installation

```bash
git clone https://github.com/bahaa-aldein/Subscription-Tracker.git
cd Subscription-Tracker
npm install
```

### Environment variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=

# Auth
JWT_SECRET=
JWT_REFRESH_SECRET=

# Upstash
QSTASH_URL=
QSTASH_TOKEN=

# Email
EMAIL_HOST=
EMAIL_USER=
EMAIL_PASS=

# Arcjet
ARCJET_KEY=
```

### Run locally

```bash
npm run dev
```

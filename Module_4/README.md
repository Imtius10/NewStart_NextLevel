# RentNest API

A full-stack rental property marketplace backend built with Node.js, Express, TypeScript, Prisma, PostgreSQL, and Stripe.

## Live Demo

- **API Base URL:** `https://rent-nest-api.vercel.app/api`
- **Postman Collection:** [View Collection](./postman_collection.json)

## Features

- **JWT Authentication** with access + refresh tokens
- **Role-Based Access Control** — Tenant, Landlord, Admin
- **Property CRUD** with search, filter, and pagination
- **Rental Request Workflow** — request → approve/reject → payment
- **Stripe Payment Integration** with webhook handling
- **Review System** for completed rentals
- **Admin Dashboard** with user management and statistics
- **Security** — helmet, bcrypt, CORS, input validation

## Tech Stack

| Layer       | Technology                |
|-------------|---------------------------|
| Runtime     | Node.js                   |
| Framework   | Express 5                 |
| Language    | TypeScript 7              |
| ORM         | Prisma 7 (PrismaPg)      |
| Database    | PostgreSQL                |
| Auth        | JWT + bcrypt              |
| Payments    | Stripe                    |
| Security    | helmet, CORS              |

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (test mode)

### Installation

```bash
git clone https://github.com/your-repo/rent-nest-api.git
cd rent-nest-api/Module_4
npm install
```

### Environment Variables

Create `.env` file:

```env
DATABASE_URL=postgresql://user:password@host:5432/rentnest
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

### Database Setup

```bash
npx prisma migrate dev
npx prisma db seed
```

### Run Development

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## Default Accounts

| Role      | Email                | Password  |
|-----------|----------------------|-----------|
| Admin     | imtius3@example.com  | 12345678  |
| Landlord  | imtius1@example.com  | 12345678  |
| Tenant    | tanvir@tenant.com    | 123456    |

## API Endpoints

### Authentication

| Method | Endpoint                | Description          | Auth     |
|--------|-------------------------|----------------------|----------|
| POST   | /api/auth/register      | Register new user    | Public   |
| POST   | /api/auth/login         | Login                | Public   |
| POST   | /api/auth/refresh-token | Refresh access token | Public   |
| POST   | /api/auth/logout        | Logout               | Any      |
| GET    | /api/auth/my-profile    | Get profile          | Any      |

### Properties

| Method | Endpoint                      | Description          | Auth     |
|--------|-------------------------------|----------------------|----------|
| GET    | /api/properties               | List properties      | Public   |
| GET    | /api/properties/categories    | Get categories       | Public   |
| GET    | /api/properties/:id           | Get property detail  | Public   |
| POST   | /api/properties               | Create property      | Landlord |
| PUT    | /api/properties/:id           | Update property      | Landlord |
| DELETE | /api/properties/:id           | Delete property      | Landlord |

### Rental Requests

| Method | Endpoint                              | Description          | Auth   |
|--------|---------------------------------------|----------------------|--------|
| POST   | /api/rentals                          | Create request       | Tenant |
| GET    | /api/rentals/my-requests              | My requests          | Tenant |
| GET    | /api/rentals/:id                      | Get request detail   | Tenant |
| GET    | /api/landlord/requests                | Landlord's requests  | Landlord |
| PATCH  | /api/landlord/requests/:id            | Approve/reject       | Landlord |
| GET    | /api/landlord/properties/:id/requests | Property requests    | Landlord |
| GET    | /api/landlord/properties              | Landlord's properties | Landlord |
| GET    | /api/admin/rental-requests            | All requests         | Admin  |

### Payments

| Method | Endpoint                  | Description          | Auth   |
|--------|---------------------------|----------------------|--------|
| POST   | /api/payments/create      | Create Stripe checkout | Tenant |
| GET    | /api/payments/my-payments | My payment history   | Tenant |
| GET    | /api/payments/:id         | Get payment detail   | Tenant |
| POST   | /api/payments/test-confirm | Dev confirm payment  | Public |
| POST   | /api/payments/webhook     | Stripe webhook       | Stripe |

### Reviews

| Method | Endpoint                        | Description      | Auth   |
|--------|---------------------------------|------------------|--------|
| POST   | /api/reviews                    | Create review    | Tenant |
| GET    | /api/reviews/property/:id       | Property reviews | Public |

### Admin

| Method | Endpoint                       | Description          | Auth  |
|--------|--------------------------------|----------------------|-------|
| GET    | /api/admin/users               | All users            | Admin |
| PATCH  | /api/admin/users/:id/status    | Ban/unban user       | Admin |
| GET    | /api/admin/properties          | All properties       | Admin |
| DELETE | /api/admin/properties/:id      | Delete property      | Admin |
| GET    | /api/admin/rental-requests     | All requests         | Admin |
| GET    | /api/admin/statistics          | System statistics    | Admin |

## Request/Response Format

### Success
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

### Error
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errorDetails": { ... }
}
```

## Project Structure

```
Module_4/
├── src/
│   ├── app.ts                    # Express app setup
│   ├── server.ts                 # Entry point
│   ├── config/                   # DB, env config
│   ├── middlewares/
│   │   ├── auth/auth.ts          # JWT + role check
│   │   └── GlobalError/          # Error handler
│   ├── module/
│   │   ├── user/                 # Auth routes
│   │   ├── properties/           # Property CRUD
│   │   ├── rentalRequest/        # Rental workflow
│   │   ├── landlord/             # Landlord actions
│   │   ├── admin/                # Admin dashboard
│   │   ├── payment/              # Stripe integration
│   │   └── review/               # Review system
│   └── utils/                    # catchAsync, sendResponse, JWT
├── prisma/
│   ├── schema/                   # Prisma models
│   └── seed.ts                   # Database seeder
├── postman_collection.json       # API testing collection
└── package.json
```

## Payment Flow

```
1. Tenant creates rental request → status: PENDING
2. Landlord approves → status: APPROVED
3. Tenant creates payment → Stripe Checkout Session
4. Tenant pays with card (4242 4242 4242 4242)
5. Stripe webhook confirms → transactionId saved
6. Tenant leaves review
```

## Development

```bash
# Run dev server
npm run dev

# Seed database
npx prisma db seed

# Build for production
npm run build

# Run production
npm start
```

## Git History

48 commits following conventional format:
- `feat:` — new features
- `fix:` — bug fixes
- `docs:` — documentation
- `refactor:` — code improvements
- `chore:` — maintenance

## License

MIT

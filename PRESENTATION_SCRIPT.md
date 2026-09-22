# RentNest API - Presentation Script

## What I Built

I built a **full-stack rental property marketplace backend API** called **RentNest** using Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, and Stripe payment integration.

The platform connects **three user roles**:

- **Tenants** — search properties, send rental requests, make payments, leave reviews
- **Landlords** — list properties, approve/reject rental requests, manage listings
- **Admin** — monitor all users, properties, rental requests, ban users, view statistics

---

## Core Features

### 1. Authentication & Authorization
- JWT-based login with access token (15 min) and refresh token (7 days)
- Role-based access control — each route checks user role
- Blocked user detection — banned users cannot access any protected endpoint
- Secure password hashing with bcrypt

### 2. Property Management
- Full CRUD — create, read, update, delete properties
- Filtering by location, category, price range
- Text search across title and description
- Pagination on all list endpoints
- Landlords manage their own properties only

### 3. Rental Request Workflow
- Tenant sends request → Landlord approves/rejects → Tenant makes payment
- Status tracking: PENDING → APPROVED/REJECTED
- Only APPROVED requests can proceed to payment

### 4. Stripe Payment Integration
- Real Stripe Checkout Sessions — users pay with card (test mode: 4242 4242 4242 4242)
- Webhook handler for payment confirmation
- Transaction ID saved from Stripe on successful payment
- Dev-mode test-confirm endpoint for testing without Stripe

### 5. Review System
- Tenants rate properties (1-5 stars) with comments
- Only tenants who completed payment can review
- Duplicate review prevention — one review per rental request

### 6. Admin Dashboard
- View all users, properties, rental requests with pagination
- Ban/unban users
- System statistics: total users, properties, rental requests by status

---

## Measurement Issues I Solved

### Issue 1: No Transaction ID on Payment
**Problem:** After Stripe payment, the transaction ID was empty in the database.
**Solution:** Added webhook handler that extracts `payment_intent` from Stripe event and saves it as `transactionId`. Added `test-confirm` endpoint for dev testing.

### Issue 2: Blocked Users Could Access API
**Problem:** Banned users could still log in and use all endpoints.
**Solution:** Added active status check in auth middleware — returns 403 if user status is BLOCKED.

### Issue 3: Missing Security Headers
**Problem:** No HTTP security headers configured.
**Solution:** Added `helmet` middleware for production-grade security headers.

### Issue 4: CORS Hardcoded to Localhost
**Problem:** CORS origin was hardcoded to `http://localhost:5000`.
**Solution:** Changed to use `process.env.CORS_ORIGIN` environment variable.

### Issue 5: No Pagination on List Endpoints
**Problem:** All list endpoints returned unlimited data.
**Solution:** Added `page` and `limit` query parameters with `meta: { page, limit, total }` response on all 8 list endpoints.

### Issue 6: Dead Code in Controller
**Problem:** Unused Zod import and empty function in user controller.
**Solution:** Cleaned up dead code to reduce bundle size and improve readability.

### Issue 7: Typo Breaking Payment Service
**Problem:** `TransactionClien` typo caused TypeScript compilation error.
**Solution:** Fixed to `TransactionClient` for proper transaction handling.

### Issue 8: Missing Refresh Token
**Problem:** Users had to re-login after token expiry.
**Solution:** Added refresh token endpoint and logout with token invalidation.

### Issue 9: No Seed Data for Testing
**Problem:** Manual user creation was slow for testing all 3 roles.
**Solution:** Created seed script with 22 users (3 admins, 9 landlords, 10 tenants) + 10 properties.

### Issue 10: Category Model Over-Engineering
**Problem:** Separate Category table added unnecessary complexity.
**Solution:** Removed Category model, used string field on Property for simpler filtering.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express 5 |
| Language | TypeScript 7 |
| ORM | Prisma 7 (PrismaPg adapter) |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |
| Payments | Stripe |
| Security | helmet, CORS, rate limiting |

---

## API Endpoints (20+)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| POST | /api/auth/refresh-token | Refresh access token |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/my-profile | Get profile |
| GET | /api/properties | List properties (public) |
| GET | /api/properties/:id | Get property details |
| GET | /api/properties/categories | Get categories |
| POST | /api/properties | Create property (landlord) |
| PUT | /api/properties/:id | Update property (landlord) |
| DELETE | /api/properties/:id | Delete property (landlord) |
| POST | /api/rentals | Create rental request (tenant) |
| GET | /api/rentals/my-requests | My rental requests |
| GET | /api/rentals/:id | Get rental request |
| GET | /api/landlord/requests | Landlord's requests |
| PATCH | /api/landlord/requests/:id | Approve/reject |
| GET | /api/landlord/properties | Landlord's properties |
| POST | /api/payments/create | Create Stripe checkout |
| GET | /api/payments/my-payments | My payment history |
| GET | /api/payments/:id | Get payment details |
| POST | /api/payments/test-confirm | Dev payment confirm |
| POST | /api/reviews | Create review |
| GET | /api/reviews/property/:id | Property reviews |
| GET | /api/admin/users | All users |
| PATCH | /api/admin/users/:id/status | Ban/unban |
| GET | /api/admin/properties | All properties |
| GET | /api/admin/rental-requests | All requests |
| GET | /api/admin/statistics | System stats |

---

## Demo Flow (3-5 minutes)

1. **Register/Login** as Tenant → show profile
2. **Search properties** → filter by location, category, price
3. **Create rental request** → show PENDING status
4. **Login as Landlord** → approve request → show APPROVED
5. **Login as Tenant** → create payment → show checkout URL
6. **Confirm payment** (test-confirm) → show transactionId
7. **Leave review** → show 5-star rating
8. **Login as Admin** → show statistics, ban user

---

## Git History: 48 commits

All commits follow conventional format: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`

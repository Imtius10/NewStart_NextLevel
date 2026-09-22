# RentNest API - Full Endpoint Video Script

## Setup (Show Terminal)
```
Open Terminal 1 → cd Module_4 → npm run dev
Open Postman → Import postman_collection.json
```

---

## PART 1: Auth (0:00 - 1:30)

### 1.1 Register
```
POST /api/auth/register
Body: { "name": "New User", "email": "new@test.com", "password": "123456", "role": "TENANT" }
→ Show 201 + user data
```

### 1.2 Login Admin
```
POST /api/auth/login
Body: { "email": "imtius3@example.com", "password": "12345678" }
→ Show 200 + token saved
Say: "Admin credentials: imtius3@example.com / 12345678"
```

### 1.3 Login Landlord
```
POST /api/auth/login
Body: { "email": "imtius1@example.com", "password": "12345678" }
→ Show 200 + token saved
Say: "Landlord has 10 seeded properties"
```

### 1.4 Login Tenant
```
POST /api/auth/login
Body: { "email": "tanvir@tenant.com", "password": "123456" }
→ Show 200 + token saved
Say: "Tenant can search and request properties"
```

### 1.5 Get Profile
```
GET /api/auth/my-profile
Header: Authorization: Bearer {{tenantToken}}
→ Show 200 + user info
Say: "Profile shows name, email, role, active status"
```

### 1.6 Refresh Token
```
POST /api/auth/refresh-token
→ Show token renewal
Say: "Access token expires in 15 minutes, refresh extends it"
```

### 1.7 Logout
```
POST /api/auth/logout
→ Show 200 success
Say: "Logout invalidates the session"
```

---

## PART 2: Properties Public (1:30 - 2:30)

### 2.1 Get All Properties
```
GET /api/properties?page=1&limit=10
→ Show 200 + array of properties + pagination meta
Say: "Public endpoint, no auth needed. Shows page 1 with 10 items"
```

### 2.2 Get Categories
```
GET /api/properties/categories
→ Show 200 + ["apartment", "house", "studio", ...]
Say: "Returns distinct categories from database"
```

### 2.3 Filter by Location
```
GET /api/properties?location=Gulshan&page=1&limit=5
→ Show filtered results
Say: "Filter properties by location"
```

### 2.4 Filter by Category
```
GET /api/properties?category=apartment&page=1&limit=5
→ Show filtered results
Say: "Filter by property category"
```

### 2.5 Filter by Price Range
```
GET /api/properties?minPrice=20000&maxPrice=50000&page=1&limit=5
→ Show filtered results
Say: "Filter by min and max price"
```

### 2.6 Search
```
GET /api/properties?search=studio&page=1&limit=5
→ Show filtered results
Say: "Text search across title and description"
```

### 2.7 Get Property by ID
```
GET /api/properties/{{propertyId}}
→ Show 200 + full property details
Say: "Get single property with landlord info"
```

---

## PART 3: Landlord - Create & Manage (2:30 - 3:30)

### 3.1 Create Property
```
POST /api/properties
Header: Authorization: Bearer {{landlordToken}}
Body: {
  "title": "New Studio Apartment",
  "description": "Modern studio in Banani",
  "price": 35000,
  "location": "Banani, Dhaka",
  "category": "studio"
}
→ Show 201 + property data
Say: "Landlord creates a new listing"
```

### 3.2 Get My Properties
```
GET /api/landlord/properties?page=1&limit=10
Header: Authorization: Bearer {{landlordToken}}
→ Show 200 + landlord's own properties only
Say: "Landlord sees only their properties"
```

### 3.3 Update Property
```
PUT /api/properties/{{propertyId}}
Header: Authorization: Bearer {{landlordToken}}
Body: { "title": "Updated Studio Apartment", "price": 38000 }
→ Show 200 + updated data
Say: "Landlord can update their property"
```

---

## PART 4: Rental Requests (3:30 - 4:30)

### 4.1 Create Rental Request (Tenant)
```
POST /api/rentals
Header: Authorization: Bearer {{tenantToken}}
Body: { "propertyId": "{{propertyId}}", "message": "I want to rent this" }
→ Show 201 + status: PENDING
Say: "Tenant sends request. Status is PENDING until landlord responds"
```

### 4.2 Get My Requests (Tenant)
```
GET /api/rentals/my-requests?page=1&limit=10
Header: Authorization: Bearer {{tenantToken}}
→ Show 200 + tenant's requests
Say: "Tenant sees all their rental requests with status"
```

### 4.3 Get Request by ID
```
GET /api/rentals/{{rentalRequestId}}
Header: Authorization: Bearer {{tenantToken}}
→ Show 200 + full request details
Say: "View single request with property and tenant info"
```

---

## PART 5: Landlord - Approve/Reject (4:30 - 5:15)

### 5.1 Get All Requests (Landlord)
```
GET /api/landlord/requests?page=1&limit=10
Header: Authorization: Bearer {{landlordToken}}
→ Show 200 + incoming requests
Say: "Landlord sees all requests on their properties"
```

### 5.2 Approve Request
```
PATCH /api/landlord/requests/{{rentalRequestId}}
Header: Authorization: Bearer {{landlordToken}}
Body: { "status": "APPROVED" }
→ Show 200 + status: APPROVED
Say: "Landlord approves. Now tenant can pay"
```

### 5.3 Get Property Requests
```
GET /api/landlord/properties/{{propertyId}}/requests
→ Show requests for specific property
Say: "See all requests for one property"
```

---

## PART 6: Payments (5:15 - 6:30)

### 6.1 Create Payment
```
POST /api/payments/create
Header: Authorization: Bearer {{tenantToken}}
Body: { "rentalRequestId": "{{rentalRequestId}}" }
→ Show 201 + payment data + checkoutUrl
Say: "Creates Stripe checkout session. Opens in browser for card payment"
Say: "Test card: 4242 4242 4242 4242, any future date, any CVC"
```

### 6.2 Get My Payments
```
GET /api/payments/my-payments?page=1&limit=10
Header: Authorization: Bearer {{tenantToken}}
→ Show 200 + payment history with status and transactionId
Say: "Tenant sees all their payments"
```

### 6.3 Confirm Payment (Dev)
```
POST /api/payments/test-confirm
Body: { "paymentId": "{{paymentId}}" }
→ Show 200 + status: PAID + transactionId: dev_pi_xxx
Say: "Dev mode confirms payment without Stripe. Saves transaction ID"
```

### 6.4 Get Payment by ID
```
GET /api/payments/{{paymentId}}
Header: Authorization: Bearer {{tenantToken}}
→ Show 200 + full payment with transactionId
Say: "Shows transaction ID from Stripe or dev confirm"
```

---

## PART 7: Reviews (6:30 - 7:15)

### 7.1 Create Review
```
POST /api/reviews
Header: Authorization: Bearer {{tenantToken}}
Body: { "rentalRequestId": "{{rentalRequestId}}", "rating": 5, "comment": "Excellent!" }
→ Show 201 + review data
Say: "Only tenants who completed payment can review"
```

### 7.2 Get Property Reviews
```
GET /api/reviews/property/{{propertyId}}?page=1&limit=10
→ Show 200 + reviews array
Say: "Public endpoint - anyone can see property reviews"
```

---

## PART 8: Admin (7:15 - 8:30)

### 8.1 Get All Users
```
GET /api/admin/users?page=1&limit=20
Header: Authorization: Bearer {{adminToken}}
→ Show 200 + all users with pagination
Say: "Admin sees all users across the platform"
```

### 8.2 Ban User
```
PATCH /api/admin/users/{{userId}}/status
Header: Authorization: Bearer {{adminToken}}
Body: { "status": "BLOCKED" }
→ Show 200 + activeStatus: BLOCKED
Say: "Ban a user - they cannot access any endpoint"
```

### 8.3 Unban User
```
PATCH /api/admin/users/{{userId}}/status
Header: Authorization: Bearer {{adminToken}}
Body: { "status": "ACTIVE" }
→ Show 200 + activeStatus: ACTIVE
Say: "Restore user access"
```

### 8.4 Get All Properties
```
GET /api/admin/properties?page=1&limit=10
Header: Authorization: Bearer {{adminToken}}
→ Show 200 + all properties
Say: "Admin sees all properties on platform"
```

### 8.5 Get All Rental Requests
```
GET /api/admin/rental-requests?page=1&limit=10
Header: Authorization: Bearer {{adminToken}}
→ Show 200 + all requests
Say: "Admin sees all rental requests"
```

### 8.6 Get Statistics
```
GET /api/admin/statistics
Header: Authorization: Bearer {{adminToken}}
→ Show 200 + { users: {total, landlords, tenants}, properties: {total}, rentalRequests: {total, pending, approved, rejected} }
Say: "System-wide statistics dashboard"
```

### 8.7 Delete Property
```
DELETE /api/admin/properties/{{propertyId}}
Header: Authorization: Bearer {{adminToken}}
→ Show 200 + deleted
Say: "Admin can remove any property"
```

---

## PART 9: Error Handling (8:30 - 9:00)

### 9.1 No Token
```
GET /api/auth/my-profile (no header)
→ Show 401 "Access token is required"
Say: "Protected routes require authentication"
```

### 9.2 Invalid Token
```
GET /api/auth/my-profile
Header: Authorization: Bearer invalidtoken123
→ Show 401 "Invalid access token"
Say: "Expired or invalid tokens are rejected"
```

### 9.3 Wrong Role
```
GET /api/admin/users
Header: Authorization: Bearer {{tenantToken}}
→ Show 403 "Forbidden"
Say: "Tenant cannot access admin routes"
```

### 9.4 Blocked User
```
Login as blocked user → show 403
Say: "Blocked users cannot access any protected endpoint"
```

---

## PART 10: Stats & Summary (9:00 - 9:30)

### Show Terminal
```
git log --oneline → 48 commits
Say: "48 git commits following conventional format"
```

### Show Database
```
npx prisma studio → show users, properties, rentals, payments, reviews tables
Say: "PostgreSQL database with 5 related tables"
```

### Show API Docs
```
Open Postman collection → show 8 folders, 30+ requests
Say: "Complete API documentation in Postman with auto-save variables"
```

---

## Closing Script

"What I built is a complete rental property marketplace backend with:
- 3 user roles with JWT authentication
- 20+ API endpoints
- Real Stripe payment integration
- PostgreSQL database with Prisma ORM
- Input validation, pagination, error handling
- 48 git commits
- Postman collection for testing

The system handles the full rental workflow:
Tenant searches → requests → landlord approves → tenant pays → tenant reviews

All measurement issues were solved:
- Transaction IDs saved from Stripe
- Blocked users rejected
- Pagination on all lists
- CORS from env variable
- Security headers with helmet"

---

## Total Runtime: ~9-10 minutes

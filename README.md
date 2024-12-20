# Auto Parts E-Commerce Backend

A robust Node.js backend for an auto parts e-commerce platform, featuring product management, image handling, and authentication.

## Features

- **Product Management**
  - CRUD operations for auto parts
  - Image upload with Cloudinary integration
  - Search and filtering capabilities
  - Pagination support

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Admin/User)
  - Secure password handling

- **Image Handling**
  - Cloudinary integration for image storage
  - Base64 image upload support
  - Automatic image cleanup

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Image Storage**: Cloudinary
- **Authentication**: JWT

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- Cloudinary account
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd autoparts-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configurations:
   - Database credentials
   - Cloudinary API keys
   - JWT secret
   - Server port

4. **Database Setup**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

## Running the Application

**Development Mode**
```bash
npm run dev
```

**Production Mode**
```bash
npm start
```

## API Endpoints

### Products
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Bulk Operations
- `POST /api/products/bulk` - Create multiple products at once
  - Request body should be an array of product objects
  - Each product object must contain:
    - `OemNo` (String, unique)
    - `codeOfProduct` (String)
    - `image` (String)
    - `name` (String, defaults to "no name")
    - `priceWithOutKDV` (Float)
    - `priceWithKDV` (Float)
  - Optional fields:
    - `discouisnt` (Float, defaults to 0)
    - `iskonto` (String)
    - `manufacturer` (String, will create or use existing manufacturer)
    - `stock` (Boolean, defaults to true)
  - Returns status code 201 on success with an object containing:
    - `message`: Operation summary message
    - `totalProcessed`: Total number of products processed
    - `successCount`: Number of successfully created products
    - `errorCount`: Number of failed operations
    - `successfulProducts`: Array of created products with manufacturer details
    - `errors`: Array of failed operations with error messages

Example bulk create request:
```json
[
  {
    "OemNo": "15208-65F0E",
    "codeOfProduct": "NIS-001",
    "image": "https://example.com/images/oil-filter-nissan.jpg",
    "name": "Nissan Qashqai Yağ Filteri",
    "priceWithOutKDV": 180.50,
    "priceWithKDV": 212.99,
    "discouisnt": 10,
    "iskonto": "5%",
    "manufacturer": "Nissan",
    "stock": true
  },
  {
    "OemNo": "04152-YZZA6",
    "codeOfProduct": "TOY-002",
    "image": "https://example.com/images/oil-filter-toyota.jpg",
    "name": "Toyota Corolla Yağ Filteri",
    "priceWithOutKDV": 165.00,
    "priceWithKDV": 194.70,
    "discouisnt": 0,
    "iskonto": "8%",
    "manufacturer": "Toyota",
    "stock": true
  }
]
```

Example response:
```json
{
  "message": "Bulk product creation completed",
  "totalProcessed": 2,
  "successCount": 2,
  "errorCount": 0,
  "successfulProducts": [
    {
      "id": "uuid-1",
      "OemNo": "15208-65F0E",
      "codeOfProduct": "NIS-001",
      "image": "https://example.com/images/oil-filter-nissan.jpg",
      "name": "Nissan Qashqai Yağ Filteri",
      "priceWithOutKDV": 180.50,
      "priceWithKDV": 212.99,
      "discouisnt": 10,
      "iskonto": "5%",
      "stock": true,
      "manufacturerId": "manufacturer-uuid-1",
      "Manufacturer": {
        "id": "manufacturer-uuid-1",
        "name": "Nissan",
        "createdAt": "2024-12-12T12:44:20.000Z",
        "updatedAt": "2024-12-12T12:44:20.000Z"
      }
    },
    {
      "id": "uuid-2",
      "OemNo": "04152-YZZA6",
      "codeOfProduct": "TOY-002",
      "image": "https://example.com/images/oil-filter-toyota.jpg",
      "name": "Toyota Corolla Yağ Filteri",
      "priceWithOutKDV": 165.00,
      "priceWithKDV": 194.70,
      "discouisnt": 0,
      "iskonto": "8%",
      "stock": true,
      "manufacturerId": "manufacturer-uuid-2",
      "Manufacturer": {
        "id": "manufacturer-uuid-2",
        "name": "Toyota",
        "createdAt": "2024-12-12T12:44:20.000Z",
        "updatedAt": "2024-12-12T12:44:20.000Z"
      }
    }
  ],
  "errors": []
}
```

Notes:
- The bulk create operation processes each product independently
- If a manufacturer name is provided, it will:
  1. First try to find an existing manufacturer with that name (case-insensitive)
  2. If not found, create a new manufacturer
  3. Link the product to the manufacturer
- Request body size limit is set to 50MB
- All string fields are automatically converted to strings, numbers to numbers
- Stock defaults to true unless explicitly set to false
- Manufacturer relationship is optional but recommended for proper categorization

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/autoparts?schema=public"
POSTGRES_URL_NON_POOLING="postgresql://user:password@localhost:5432/autoparts?schema=public"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Database Schema

### Models

#### User
```prisma
model User {
  id       String     @id @default(uuid())
  name     String
  email    String     @unique
  password String
  role     Role       @default(USER)
  cart     CartItem[]
}
```

#### Product
```prisma
model Product {
  id             String  @id @default(uuid())
  codeOfProduct  String
  manufacturerId String?
  name           String  @default("no name")
  manufacturer   String? @default("")
  iskonto        String?
  priceWithOutKDV Float
  priceWithKDV    Float
  stock           Boolean @default(true)
  OemNo           String
  image           String
  discouisnt      Float   @default(0)
  cartItems       CartItem[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  Manufacturer    Manufacturer? @relation(fields: [manufacturerId], references: [id])
}
```

#### Manufacturer
```prisma
model Manufacturer {
  id        String    @id @default(uuid())
  name      String
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

#### CartItem
```prisma
model CartItem {
  id        String   @id @default(uuid())
  quantity  Int      @default(1)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, productId])
}
```

### Enums

```prisma
enum Role {
  ADMIN
  USER
}
```

## Product Schema

```prisma
model Product {
  id            String     @id @default(uuid())
  OemNo         String     @unique
  codeOfProduct String
  image         String
  name          String     @default("no name")
  priceWithOutKDV Float
  priceWithKDV  Float
  discouisnt    Float      @default(0)
  iskonto       String?
  manufacturer  String?    @default("")
  stock         Boolean    @default(true)
  cartItems     CartItem[]
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}
```

## Authentication

The API uses JWT for authentication. Include the token in the Authorization header:
```
Authorization: Bearer [your-token]
```

## Image Upload

- Supports base64 image upload
- Images are stored in Cloudinary
- Automatic cleanup of old images during updates
- Supported formats: JPEG, PNG, WebP

## Error Handling

The API implements comprehensive error handling:
- Validation errors
- Authentication errors
- Database errors
- Image upload errors

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Table of Contents
- [Authentication](#authentication)
- [Products](#products)
- [Cart](#cart)
- [Error Handling](#error-handling)

## Authentication

### Register User
```http
POST /api/auth/register
```

Request Body:
```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Test123!"
}
```

Success Response (200):
```json
{
    "message": "User registered successfully",
    "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "USER"
    }
}
```

### Login
```http
POST /api/auth/login
```

Request Body:
```json
{
    "email": "john@example.com",
    "password": "Test123!"
}
```

Success Response (200):
```json
{
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "USER"
    }
}
```

## Products

### Get All Products
```http
GET /api/products?page=1&limit=10&search=toyota&manufacturer=toyota&inStock=true
```

Success Response (200):
```json
{
    "products": [
        {
            "id": "uuid",
            "name": "Toyota Brake Pad",
            "OemNo": "04465-33471",
            "codeOfProduct": "TBP-123",
            "image": "image_url",
            "priceWithOutKDV": 150.00,
            "priceWithKDV": 177.00,
            "discouisnt": 0,
            "iskonto": "5%",
            "manufacturer": "Toyota",
            "stock": true
        }
    ],
    "totalPages": 10,
    "currentPage": 1,
    "total": 100
}
```

### Get Product by ID
```http
GET /api/products/:id
```

Success Response (200):
```json
{
    "id": "uuid",
    "name": "Toyota Brake Pad",
    "OemNo": "04465-33471",
    "codeOfProduct": "TBP-123",
    "image": "image_url",
    "priceWithOutKDV": 150.00,
    "priceWithKDV": 177.00,
    "discouisnt": 0,
    "iskonto": "5%",
    "manufacturer": "Toyota",
    "stock": true
}
```

### Create Product (Admin Only)
```http
POST /api/products
```

Request Body:
```json
{
    "name": "Toyota Brake Pad",
    "OemNo": "04465-33471",
    "codeOfProduct": "TBP-123",
    "image": "image_url",
    "priceWithOutKDV": 150.00,
    "priceWithKDV": 177.00,
    "discouisnt": 0,
    "iskonto": "5%",
    "manufacturer": "Toyota",
    "stock": true
}
```

Success Response (201):
```json
{
    "id": "uuid",
    "name": "Toyota Brake Pad",
    "OemNo": "04465-33471",
    "codeOfProduct": "TBP-123",
    "image": "image_url",
    "priceWithOutKDV": 150.00,
    "priceWithKDV": 177.00,
    "discouisnt": 0,
    "iskonto": "5%",
    "manufacturer": "Toyota",
    "stock": true
}
```

### Update Product (Admin Only)
```http
PUT /api/products/:id
```

Request Body:
```json
{
    "priceWithOutKDV": 160.00,
    "priceWithKDV": 189.00,
    "stock": true,
    "discouisnt": 10
}
```

Success Response (200):
```json
{
    "id": "uuid",
    "name": "Toyota Brake Pad",
    "OemNo": "04465-33471",
    "codeOfProduct": "TBP-123",
    "image": "image_url",
    "priceWithOutKDV": 160.00,
    "priceWithKDV": 189.00,
    "discouisnt": 10,
    "iskonto": "5%",
    "manufacturer": "Toyota",
    "stock": true
}
```

### Delete Product (Admin Only)
```http
DELETE /api/products/:id
```

Success Response (200):
```json
{
    "message": "Product deleted successfully"
}
```

## Cart

### Get Cart Items
```http
GET /api/cart
```

Success Response (200):
```json
{
    "items": [
        {
            "id": "uuid",
            "quantity": 2,
            "product": {
                "id": "uuid",
                "name": "Toyota Brake Pad",
                "priceWithOutKDV": 150.00,
                "priceWithKDV": 177.00
            }
        }
    ]
}
```

### Add to Cart
```http
POST /api/cart
```

Request Body:
```json
{
    "productId": "uuid",
    "quantity": 2
}
```

Success Response (200):
```json
{
    "message": "Item added to cart successfully",
    "item": {
        "id": "uuid",
        "quantity": 2,
        "product": {
            "id": "uuid",
            "name": "Toyota Brake Pad",
            "priceWithOutKDV": 150.00,
            "priceWithKDV": 177.00
        }
    }
}
```

### Update Cart Item
```http
PUT /api/cart/:itemId
```

Request Body:
```json
{
    "quantity": 3
}
```

Success Response (200):
```json
{
    "message": "Cart item updated successfully",
    "item": {
        "id": "uuid",
        "quantity": 3,
        "product": {
            "id": "uuid",
            "name": "Toyota Brake Pad",
            "priceWithOutKDV": 150.00,
            "priceWithKDV": 177.00
        }
    }
}
```

### Remove from Cart
```http
DELETE /api/cart/:itemId
```

Success Response (200):
```json
{
    "message": "Item removed from cart successfully"
}
```

## Error Handling

### Error Response Format
```json
{
    "message": "Error message here",
    "errors": [
        {
            "field": "email",
            "message": "Invalid email address"
        }
    ]
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

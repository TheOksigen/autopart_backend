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

## Product Schema

```prisma
model Product {
  id            String     @id @default(uuid())
  OemNo         String     @unique
  codeOfProduct String
  image         String
  name          String     @default("no name")
  price         Int
  priceWithKDV  Int
  discount      Int        @default(0)
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
            "price": 150,
            "priceWithKDV": 177,
            "discount": 0,
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
    "price": 150,
    "priceWithKDV": 177,
    "discount": 0,
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
    "price": 150,
    "priceWithKDV": 177,
    "discount": 0,
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
    "price": 150,
    "priceWithKDV": 177,
    "discount": 0,
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
    "price": 160,
    "priceWithKDV": 189,
    "stock": true,
    "discount": 10
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
    "price": 160,
    "priceWithKDV": 189,
    "discount": 10,
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
                "price": 150,
                "priceWithKDV": 177
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
            "price": 150,
            "priceWithKDV": 177
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
            "price": 150,
            "priceWithKDV": 177
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

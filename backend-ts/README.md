# Eduskill Backend - TypeScript

Professional TypeScript backend for the Eduskill Learning Platform with full authentication, database integration, and payment processing.

## Features

✅ **TypeScript** - Full type safety
✅ **Express.js** - Fast and lightweight web framework
✅ **MongoDB** - NoSQL database with Mongoose ODM
✅ **JWT Authentication** - Secure token-based authentication
✅ **Password Hashing** - Bcrypt for secure password storage
✅ **Razorpay Integration** - Payment processing
✅ **CORS Support** - Cross-origin requests
✅ **Environment Variables** - Secure configuration

## Project Structure

```
backend-ts/
├── src/
│   ├── config/
│   │   └── db.ts              # MongoDB connection
│   ├── controllers/
│   │   ├── profileController.ts  # User signup/login logic
│   │   └── paymentController.ts  # Payment processing
│   ├── middleware/
│   │   └── jwt.ts             # JWT authentication
│   ├── models/
│   │   └── Profile.ts         # User schema
│   ├── routes/
│   │   ├── profileRoutes.ts    # Auth routes
│   │   └── paymentRoutes.ts    # Payment routes
│   └── index.ts               # Main server file
├── dist/                      # Compiled JavaScript (generated)
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── .env.example               # Environment variables template
└── README.md
```

## Installation

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB database

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables:**
   ```
   MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/eduskill
   JWT_SECRET=your_secret_key_here
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   PORT=5000
   NODE_ENV=development
   ```

## Development

**Start development server with hot reload:**
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## Production

**Build:**
```bash
npm run build
```

**Start:**
```bash
npm start
```

## API Endpoints

### Authentication

#### Sign Up
```http
POST /Profile/signup
Content-Type: application/json

{
  "username": "johndoe",
  "name": "John Doe",
  "Branch": "Computer",
  "Email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /Profile/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

#### Get Profile
```http
GET /Profile/profile
Authorization: Bearer {token}
```

#### Logout
```http
POST /Profile/logout
Authorization: Bearer {token}
```

### Payments

#### Create Order
```http
POST /createOrder
Content-Type: application/json

{
  "name": "Web Development Course",
  "amount": 500,
  "description": "Complete Web Development Course"
}
```

**Response:**
```json
{
  "success": true,
  "msg": "Order Created",
  "order_id": "order_KyqOvzL...",
  "amount": 50000,
  "key_id": "razorpay_key_id",
  "product_name": "Web Development Course"
}
```

#### Verify Payment
```http
POST /verifyPayment
Content-Type: application/json

{
  "razorpay_order_id": "order_id",
  "razorpay_payment_id": "payment_id",
  "razorpay_signature": "signature"
}
```

### Health Check
```http
GET /health
```

## Models

### Profile Schema

```typescript
{
  name: String (required),
  username: String,
  Branch: String (required, enum: ['Computer', 'AIDS', 'Computer science(data science)']),
  mobileno: Number,
  Email: String (required, unique),
  password: String (required, hashed)
}
```

## Security

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: 2-day expiration
- **CORS**: Configured for allowed origins
- **HTTP Only Cookies**: Secure token storage
- **Environment Variables**: Sensitive data protection

## Technologies

- **Express.js** ^4.21.2
- **Mongoose** ^8.10.0
- **TypeScript** ^5.3.3
- **Bcryptjs** ^2.4.3
- **JWT** ^9.0.2
- **Razorpay** ^2.9.5
- **CORS** ^2.8.5
- **dotenv** ^16.4.7

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error info"
}
```

## Deployment

### Deploy to Render

1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy

### Deploy to Railway

1. Connect GitHub repository
2. Set environment variables
3. Deploy

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC License - See package.json

## Support

For issues and questions, visit: https://github.com/yashdarekar17/Eduskill

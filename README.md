# Infographic Creator - Backend

This is the backend service for the Infographic Creator application, built with Node.js, Express, and MongoDB.

## Features

- User authentication (JWT, Google OAuth)
- Infographic CRUD operations
- File uploads with Cloudinary
- Rate limiting and security best practices
- API documentation with Swagger
- Error handling and logging
- Environment-based configuration

## Prerequisites

- Node.js 20 or higher
- MongoDB Atlas or local MongoDB instance
- Cloudinary account (for file uploads)
- Google OAuth credentials (for social login)
- Mailtrap account (for email in development)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/infographic-creator.git
   cd infographic-creator/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your configuration.

4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm test` - Run tests (coming soon)
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Environment Variables

See `.env.example` for all available environment variables.

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: http://localhost:3001/api-docs
- API Spec (JSON): http://localhost:3001/api-docs.json

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── validations/    # Request validations
│   └── views/          # Email templates
├── .env.example        # Example environment variables
├── .gitignore
├── app.js              # Express app setup
├── package.json
└── server.js           # Server entry point
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the JWT token in the `Authorization` header for protected routes:

```
Authorization: Bearer <token>
```

## Error Handling

Errors are returned in the following format:

```json
{
  "status": "error",
  "message": "Error message",
  "code": 400,
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Rate Limiting

API is rate limited to 100 requests per hour per IP address by default. You can adjust this in the `.env` file.

## Security

- Helmet for HTTP headers security
- XSS protection
- CORS enabled
- Rate limiting
- Request validation
- Secure cookie settings
- Password hashing with bcrypt

## Deployment

1. Set `NODE_ENV=production` in your environment variables
2. Update all necessary environment variables for production
3. Make sure to use HTTPS in production
4. Consider using a process manager like PM2

## License

MIT

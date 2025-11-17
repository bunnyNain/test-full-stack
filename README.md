# AI Studio

A mini AI Studio web application that allows users to upload images and generate simulated AI results with a focus on clean code, robust architecture, testing, and user experience.

## Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Image Upload**: Upload images (JPEG/PNG, max 10MB) with live preview
- **Generation Studio**: Create AI generations with customizable prompts and styles
- **Error Handling**: Graceful handling of simulated "Model overloaded" errors with automatic retry (up to 3 attempts)
- **Abort Functionality**: Cancel in-flight generation requests
- **Generation History**: View last 5 generations with ability to restore them
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: Keyboard navigation, focus states, and ARIA labels

## Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- SQLite database
- JWT authentication with bcrypt
- Multer for file uploads
- Zod for validation
- Jest + Supertest for testing

### Frontend
- React + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router
- Axios
- Vitest + React Testing Library

### E2E Testing
- Playwright

### DevOps
- GitHub Actions CI/CD
- ESLint + Prettier

## Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher

## Setup Instructions

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install E2E test dependencies
cd ../tests
npm install
npx playwright install
```

### 2. Environment Configuration

The backend uses environment variables. A `.env` file is already configured with development defaults in `backend/.env`:

```env
PORT=3001
JWT_SECRET=dev-secret-key-please-change-in-production-12345
NODE_ENV=development
DATABASE_PATH=./database.sqlite
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

## Running the Application

### Development Mode

#### Option 1: Run everything together
```bash
# From the root directory
npm run dev
```

#### Option 2: Run separately
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### Production Build

```bash
# Build backend
cd backend
npm run build
npm start

# Build frontend
cd frontend
npm run build
npm run preview
```

## Running Tests

### Backend Tests
```bash
cd backend
npm test                 # Run tests with coverage
npm run test:watch      # Run tests in watch mode
```

### Frontend Tests
```bash
cd frontend
npm test                 # Run tests with coverage
npm run test:watch      # Run tests in watch mode
```

### E2E Tests
```bash
cd tests
npm test                 # Run Playwright tests
npm run test:headed     # Run with browser visible
npm run test:ui         # Run with Playwright UI
```

### Run All Tests
```bash
# From root directory
npm test
```

## Linting

```bash
# Backend
cd backend
npm run lint
npm run lint:fix

# Frontend
cd frontend
npm run lint
npm run lint:fix
```

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/          # Database and environment config
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth, validation, upload
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── types/           # TypeScript interfaces
│   │   └── index.ts         # Express app entry point
│   └── tests/               # Backend tests
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks (useGenerate, useRetry)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client and auth context
│   │   ├── types/           # TypeScript interfaces
│   │   └── main.tsx         # App entry point
│   └── tests/               # Frontend tests
├── tests/
│   └── e2e/                 # End-to-end tests
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI
├── OPENAPI.yaml             # API specification
├── EVAL.md                  # Feature checklist
├── AI_USAGE.md              # AI tool usage documentation
└── README.md                # This file
```

## API Endpoints

See [OPENAPI.yaml](./OPENAPI.yaml) for complete API documentation.

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login to existing account

### Generations
- `POST /generations` - Create new generation (requires auth)
- `GET /generations?limit=5` - Get user's recent generations (requires auth)

## Key Features Implementation

### Authentication
- JWT-based authentication with secure password hashing (bcrypt)
- Token persistence in localStorage
- Protected routes requiring authentication

### Image Generation Flow
1. User uploads an image (max 10MB, JPEG/PNG)
2. Enters a prompt and selects a style
3. Clicks "Generate"
4. Backend simulates processing (1-2 second delay)
5. 20% chance of "Model overloaded" error
6. Frontend automatically retries up to 3 times with exponential backoff
7. User can abort generation at any time
8. Successful generation is displayed and added to history

### Error Handling
- Client-side validation for all inputs
- Server-side validation with Zod schemas
- Consistent error response structure
- User-friendly error messages
- Automatic retry with exponential backoff for transient errors

### Accessibility
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus states for all interactive elements
- Screen reader friendly

## CI/CD

The project uses GitHub Actions for continuous integration:
- Runs on push and pull requests
- Executes backend tests with coverage
- Executes frontend tests with coverage
- Runs E2E tests with Playwright
- Builds both backend and frontend
- Uploads coverage reports and test artifacts

## TODOs / Future Improvements

- Add image resizing before upload (bonus feature)
- Implement code splitting and lazy loading
- Add dark mode toggle
- Add UI animations with Framer Motion
- Set up Docker and docker-compose
- Add rate limiting
- Implement refresh token mechanism
- Add image compression
- Deploy to cloud platform

## License

MIT

## Contact

For questions or support, please contact the development team.

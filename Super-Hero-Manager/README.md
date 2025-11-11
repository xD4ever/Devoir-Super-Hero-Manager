# Super Hero Manager

A full-stack application for managing superheroes with authentication, role-based access control, and CRUD operations.

## Project Structure

```
Super-Hero-Manager/
│
├── README.md
├── .gitignore
├── docker-compose.yml
│
├── backend/                    # Node.js + Express + MongoDB
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   │
│   ├── src/
│   │   ├── index.ts           # Main server entry point
│   │   ├── config/
│   │   │   └── db.ts          # MongoDB connection
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── Hero.ts
│   │   │   └── User.ts
│   │   ├── controllers/       # Business logic
│   │   │   ├── heroController.ts
│   │   │   └── authController.ts
│   │   ├── routes/            # Express routes
│   │   │   ├── heroRoutes.ts
│   │   │   └── authRoutes.ts
│   │   ├── middleware/        # Authentication, authorization, upload
│   │   │   ├── authMiddleware.ts
│   │   │   ├── roleMiddleware.ts
│   │   │   └── uploadMiddleware.ts
│   │   ├── utils/             # Utilities
│   │   │   ├── logger.ts
│   │   │   └── seedDatabase.ts
│   │   ├── uploads/           # Uploaded images
│   │   └── SuperHerosComplet.json
│   │
│   └── tests/
│
├── frontend/                   # React + TypeScript + Vite
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── index.html
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   │
│   │   ├── api/               # API calls
│   │   │   ├── heroApi.ts
│   │   │   └── authApi.ts
│   │   │
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroCard.tsx
│   │   │   ├── HeroForm.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── pages/             # Main pages
│   │   │   ├── LoginPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── HeroDetails.tsx
│   │   │   ├── AddHero.tsx
│   │   │   ├── EditHero.tsx
│   │   │   └── AdminPage.tsx
│   │   │
│   │   ├── context/           # Global state management
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── hooks/             # Custom hooks
│   │   │   └── useAuth.ts
│   │   │
│   │   ├── styles/            # Global styles
│   │   │   └── index.css
│   │   │
│   │   └── types/             # TypeScript interfaces
│   │       └── Hero.ts
│   │
│   └── tests/
│
└── scripts/                    # Automation scripts
```

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (Admin, Editor, Viewer)
- **Hero Management**: Full CRUD operations for superheroes
- **Image Upload**: Support for hero image uploads
- **Search & Filter**: Search heroes by name, filter by publisher and alignment
- **Responsive UI**: Built with React and modern CSS
- **Type Safety**: Full TypeScript support on both frontend and backend
- **Database**: MongoDB with Mongoose ODM

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v7 or higher)
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
   - `MONGO_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `PORT`: Server port (default: 5000)

4. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Using Docker

To run the entire application with Docker:

```bash
docker-compose up -d
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Heroes
- `GET /api/heroes` - Get all heroes
- `GET /api/heroes/:id` - Get a single hero
- `POST /api/heroes` - Create a new hero (admin/editor only)
- `PUT /api/heroes/:id` - Update a hero (admin/editor only)
- `DELETE /api/heroes/:id` - Delete a hero (admin only)

## User Roles

- **Admin**: Full access including user management and hero deletion
- **Editor**: Can create and edit heroes
- **Viewer**: Read-only access to heroes

## Technologies

### Backend
- Node.js, Express.js, MongoDB, Mongoose, TypeScript, JWT, Multer, bcryptjs

### Frontend
- React 19, TypeScript, Vite, React Router, Axios

## License

ISC
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

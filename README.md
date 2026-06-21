# Agrani School ERP - Frontend

A modern school management system frontend built with React, TypeScript, and Vite.

**Current Status**: Early Development (Authentication Only)
**Production Readiness**: 1/10
**Module Completeness**: 9.5% (Authentication 90%, Business Modules 0%)

## Current Implementation

**Implemented:**
- Authentication pages (Login, ForgotPassword, ResetPassword, SuperAdminLogin)
- Basic authentication context
- Axios configuration with token interceptors
- Toast notifications (Sonner)
- Error boundary component
- Loading spinner component
- TypeScript configuration (mixed .jsx/.tsx files)

**Not Implemented:**
- All business modules (Student, Teacher, Parent, Principal, Super Admin dashboards)
- React Query integration (installed but not used)
- react-hook-form integration (installed but not used)
- Zod validation schemas (installed but not used)
- Permission system (constants defined but not integrated)
- Membership context (file exists but not implemented)
- Multi-tenant membership switching

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety (partial migration, mixed .jsx/.tsx)
- **Vite** - Build tool
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **TailwindCSS** - Styling

**Installed but Not Utilized:**
- React Query (server state management)
- react-hook-form (form management)
- Zod (schema validation)

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Setup

1. Clone the repository
```bash
git clone <repository-url>
cd agrani-school-frontend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
VITE_API_BASE=http://localhost:4000
VITE_ENV=development
```

4. Start development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## Project Structure

```
src/
├── api/                 # API calls organized by feature
│   ├── auth.ts         # Authentication API
│   └── features/       # Feature-specific APIs
│       ├── attendance/
│       ├── classes/
│       ├── grades/
│       └── ...
├── components/          # Reusable components
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   └── ...
├── context/            # React Context providers
│   ├── AuthContext.tsx
│   ├── MembershipContext.tsx
│   └── PermissionContext.tsx
├── hooks/              # Custom React hooks
│   ├── useAuthQuery.ts
│   ├── useMembershipQuery.ts
│   └── useResourceAccess.ts
├── layouts/            # Layout components
│   └── AppLayout.jsx
├── pages/              # Page components
│   ├── Login.tsx
│   ├── ForgotPassword.tsx
│   └── ResetPassword.tsx
├── schemas/            # Validation schemas
│   └── validation.ts
├── types/              # TypeScript type definitions
│   ├── index.ts
│   └── context.ts
├── utils/              # Utility functions
│   ├── axios.ts
│   └── resourceAccess.ts
├── config/             # Configuration files
│   └── navigation.ts
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE` | Backend API base URL | `http://localhost:4000` |
| `VITE_ENV` | Environment (development/production) | `development` |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication Flow

1. User logs in via `/login` or `/superadmin-login`
2. Backend sets httpOnly cookies for authentication
3. AuthContext fetches user data and permissions
4. MembershipContext loads user's memberships
5. User selects active membership (if multiple)
6. All API calls include membership context headers

## Permission System

The application uses a resource-based permission system:
- Format: `RESOURCE_ACTION` (e.g., `STUDENT_READ`, `CLASS_WRITE`)
- Permissions are checked at route level using ProtectedRoute
- Components can check permissions using `useHasPermission` hook

## Multi-Tenancy

- Each user can belong to multiple schools (memberships)
- Active membership is stored in localStorage
- API calls include `X-Membership-Id` header for data isolation
- Users can switch between memberships using the membership selector

## Contributing

1. Create a feature branch
2. Make your changes
3. Follow the existing code style
4. Test thoroughly
5. Submit a pull request

## License

[Your License Here]

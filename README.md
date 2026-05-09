# NextCampus — Discover. Compare. Decide.

A production-grade college discovery and decision platform built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and PostgreSQL (Neon).

## Features

- **College Listing** — Responsive grid with search, filters (type, state, fees, course), and pagination
- **College Detail** — Full detail page with hero, overview, courses, placements, facilities, and reviews
- **Compare Colleges** — Side-by-side comparison table for up to 3 colleges with smart highlighting
- **Auth** — JWT-based register/login with HTTP-only cookies and bcrypt password hashing
- **Saved Colleges** — Protected page to save and manage favorite colleges

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| ORM | Prisma v5 |
| Database | PostgreSQL (Neon) |
| Auth | JWT + bcryptjs |
| Validation | Zod v4 |
| Icons | react-icons |
| Deployment | Vercel |

## Project Structure

```
nextcampus/
├── app/
│   ├── api/
│   │   ├── auth/login/       POST — login
│   │   ├── auth/register/    POST — register
│   │   ├── auth/logout/      POST — logout
│   │   ├── auth/me/          GET  — current user
│   │   ├── colleges/         GET  — list with search/filter/pagination
│   │   ├── colleges/[id]/    GET  — single college
│   │   ├── saved/            GET, POST — saved colleges
│   │   └── saved/[id]/       DELETE — remove saved
│   ├── auth/login/           Login page
│   ├── auth/register/        Register page
│   ├── colleges/[id]/        College detail page
│   ├── compare/              Compare page
│   ├── saved/                Saved colleges page
│   ├── layout.tsx            Root layout with Navbar + Footer
│   └── page.tsx              Home — college listing
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── CollegeCard.tsx
│   ├── SearchBar.tsx
│   ├── FilterSidebar.tsx
│   ├── CompareTable.tsx
│   ├── Button.tsx
│   ├── Loader.tsx
│   └── EmptyState.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useSaved.ts
├── lib/
│   ├── prisma.ts
│   └── auth.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── types/
    └── index.ts
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env` file:

```env
DATABASE_URL=your_neon_postgresql_connection_string
JWT_SECRET=your-secure-random-secret
```

### 3. Push schema and seed database

```bash
npx prisma db push
npm run seed
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL` — Neon PostgreSQL connection string
   - `JWT_SECRET` — A strong random secret (use `openssl rand -base64 32`)
4. Deploy

## Database Schema

```prisma
model College {
  id            String   @id @default(cuid())
  name          String
  location      String
  state         String
  fees          Int
  rating        Float
  description   String
  placements    String
  image         String
  courses       String[]
  facilities    String[]
  type          String   // IIT | NIT | Private | Deemed | State
  established   Int
  totalStudents Int
  createdAt     DateTime @default(now())
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String   // bcrypt hashed
  createdAt DateTime @default(now())
}

model SavedCollege {
  id        String   @id @default(cuid())
  userId    String
  collegeId String
  createdAt DateTime @default(now())
  @@unique([userId, collegeId])
}
```

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/colleges` | No | List colleges (search, filter, paginate) |
| GET | `/api/colleges/:id` | No | Get college by ID |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/auth/logout` | No | Logout |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/saved` | Yes | Get saved colleges |
| POST | `/api/saved` | Yes | Save a college |
| DELETE | `/api/saved/:id` | Yes | Remove saved college |

### Query Parameters for `/api/colleges`

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search by name, location, description |
| `type` | string | Filter by type (IIT, NIT, Private, Deemed, State) |
| `location` | string | Filter by state |
| `course` | string | Filter by course |
| `minFees` | number | Minimum annual fees |
| `maxFees` | number | Maximum annual fees |
| `page` | number | Page number (default: 1) |
| `pageSize` | number | Results per page (default: 9, max: 20) |

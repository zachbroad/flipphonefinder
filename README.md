# FlipPhoneFinder

Find and compare flip phones, dumbphones, and minimalist devices designed for digital wellness.

## Features

- Browse and search a catalog of 100+ flip phones and dumbphones with detailed specs
- Side-by-side phone comparison tool
- Individual phone detail pages with network compatibility, camera, and feature data
- Curated guides covering buyer advice, digital detox, switching tips, and more
- Blog with articles on the minimalist phone lifestyle

## Tech Stack

- **Framework:** Next.js 15 (App Router, React 19, Turbopack)
- **Database:** PostgreSQL via Supabase
- **ORM:** Drizzle ORM with Drizzle Kit for migrations
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A Supabase project (or any PostgreSQL database)

### Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/zachbroad/flipphonefinder.git
   cd flipphonefinder
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Create a `.env` file in the project root with your database credentials:

   ```
   DATABASE_URL=postgresql://user:password@host:port/dbname
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Push the database schema:

   ```sh
   pnpm db:push
   ```

5. Start the development server:

   ```sh
   pnpm dev
   ```

   The app will be available at `http://localhost:3000`.

### Database Commands

| Command            | Description                        |
| ------------------ | ---------------------------------- |
| `pnpm db:generate` | Generate migration files           |
| `pnpm db:migrate`  | Run pending migrations             |
| `pnpm db:push`     | Push schema directly to database   |
| `pnpm db:studio`   | Open Drizzle Studio for browsing   |

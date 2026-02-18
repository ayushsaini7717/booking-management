# Smart Bookmarks

A modern bookmark manager built with Next.js, Supabase, and Tailwind CSS. Save and organize your favorite links with real-time synchronization across all your devices.

## Features

- **Google OAuth Authentication**: Simple sign-up and login with your Google account
- **Real-time Updates**: Bookmarks sync instantly across all tabs and devices using Supabase Realtime
- **Private Bookmarks**: Each user's bookmarks are completely private and secured with Row Level Security (RLS)
- **Clean UI**: Modern, responsive design built with Tailwind CSS and shadcn/ui components
- **Quick Add**: Add bookmarks with just a title and URL
- **Easy Management**: Delete bookmarks with a single click
- **Deployed on Vercel**: Fast, reliable hosting with automatic deployments

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth with Google OAuth
- **Real-time**: Supabase Realtime subscriptions
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- A Supabase project with Google OAuth configured
- A Vercel account for deployment

### Local Development

1. **Clone the repository** (or download the code)
   ```bash
   git clone <repo-url>
   cd smart-bookmarks
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up the database**
   
   Run the SQL migration in your Supabase dashboard (`scripts/001_create_bookmarks_table.sql`):
   - Go to your Supabase project
   - Open the SQL Editor
   - Create a new query and paste the contents of `scripts/001_create_bookmarks_table.sql`
   - Execute the query

5. **Configure Google OAuth in Supabase**
   - Go to Authentication - Providers in your Supabase dashboard
   - Enable Google provider
   - Add your Google OAuth credentials
   - Set redirect URL to `http://localhost:3000/auth/callback` (for local development)

6. **Run the development server**
   ```bash
   pnpm dev
   ```

7. **Open your browser**
   ```
   http://localhost:3000
   ```

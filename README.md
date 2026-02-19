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

6. **Run the development server**
   ```bash
   pnpm dev
   ```

7. **Open your browser**
   ```
   http://localhost:3000
   ```

## Problems Faced and Solutions

During the development of this project, I encountered a few interesting challenges. Here's how I solved them:

### 1. Real-time Updates for INSERT Events Not Triggering

**Problem:**
I set up a Supabase Realtime subscription to the `bookmarks` table. While `DELETE` events were being received by the client instantly, `INSERT` events (creating a new bookmark) were not triggering the subscription callback in other tabs.

**Investigation:**
- I verified the client-side subscription code was correct.
- I confirmed the `INSERT` operation was successful in the database.
- I suspected Row Level Security (RLS) policies were involved.

**Solution:**
The issue was indeed due to RLS policies. The `INSERT` event payload was being filtered out because the new row wasn't immediately "visible" to the subscriber under the existing policy during the transaction snapshot used by Realtime.
I fixed this by refining the RLS policies in Supabase to ensure that users have full access to their own rows for all operations (`INSERT`, `SELECT`, `UPDATE`, `DELETE`), and ensuring the `supabase_realtime` publication was correctly configured with `replica identity full`.

### 2. Production Redirection to Localhost

**Problem:**
After deploying the application to Vercel, Google OAuth login would initiate correctly, but after successful authentication, users were redirected to:
   http://localhost:3000
instead of the production domain.

**Investigation:**
- Verified Supabase Site URL and Redirect URLs configuration.
- I looked Supabase Auth configuration.
- Found URL set to http://localhost:3000 in the Redirect URLs.

**Solution:**
I updated the Redirect URLs to include the production domain.

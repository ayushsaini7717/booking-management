import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-3xl text-center space-y-12">
        <div className="space-y-6 pt-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl">
              📑
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-6xl font-bold tracking-tight text-foreground">Smart Bookmarks</h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Save and organize your favorite links with real-time synchronization. Access your bookmarks anywhere, anytime.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pb-4">
          <Link href="/auth/login" className="flex-1 sm:flex-none">
            <Button size="lg" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/sign-up" className="flex-1 sm:flex-none">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Create Account
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 pt-12 border-t border-border">
          <div className="space-y-3 p-4">
            <div className="text-2xl">⚡</div>
            <h3 className="font-semibold text-base">Real-time Sync</h3>
            <p className="text-sm text-muted-foreground">
              See your bookmarks update instantly across all your tabs.
            </p>
          </div>
          <div className="space-y-3 p-4">
            <div className="text-2xl">🔒</div>
            <h3 className="font-semibold text-base">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              Your bookmarks are encrypted and only visible to you.
            </p>
          </div>
          <div className="space-y-3 p-4">
            <div className="text-2xl">🔐</div>
            <h3 className="font-semibold text-base">Google Sign-in</h3>
            <p className="text-sm text-muted-foreground">
              Sign up and log in seamlessly with your Google account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

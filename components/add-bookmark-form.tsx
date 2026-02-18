'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'

import { Bookmark } from '@/components/bookmark-list'

interface AddBookmarkFormProps {
  userId: string
  onBookmarkAdded?: (bookmark: Bookmark) => void
}

export function AddBookmarkForm({ userId, onBookmarkAdded }: AddBookmarkFormProps) {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      if (!title.trim() || !url.trim()) {
        setError('Please fill in all fields')
        setIsLoading(false)
        return
      }

      // Validate URL format
      try {
        new URL(url)
      } catch {
        setError('Please enter a valid URL')
        setIsLoading(false)
        return
      }

      const { data, error: insertError } = await supabase
        .from('bookmarks')
        .insert({
          user_id: userId,
          title: title.trim(),
          url: url.trim(),
        })
        .select()
        .single()

      if (insertError) throw insertError

      if (data && onBookmarkAdded) {
        console.log('Bookmark inserted successfully:', data)
        onBookmarkAdded(data as Bookmark)
      }

      setTitle('')
      setUrl('')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Failed to add bookmark')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border shadow-sm">
      <div className="p-6 pb-0">
        <h3 className="text-xl font-semibold leading-none tracking-tight">Add New Bookmark</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Save a URL to your collection for easy access later.
        </p>
      </div>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. My favorite article"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</p>}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Adding...' : 'Save Bookmark'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

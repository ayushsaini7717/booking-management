import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Trash2, ExternalLink } from 'lucide-react'

export interface Bookmark {
  id: string
  title: string
  url: string
  created_at: string
  user_id: string
}

interface BookmarkListProps {
  bookmarks: Bookmark[]
  isLoading: boolean
  error: string | null
  onDelete: (id: string) => Promise<void>
}

export function BookmarkList({ bookmarks, isLoading, error, onDelete }: BookmarkListProps) {
  if (isLoading && bookmarks.length === 0) {
    return <div className="text-center text-muted-foreground">Loading bookmarks...</div>
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>
  }

  if (bookmarks.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-2">No bookmarks yet</p>
            <p className="text-sm text-muted-foreground">Add a bookmark above to get started</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-3">
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id} className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base line-clamp-2 text-foreground">{bookmark.title}</h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary/80 underline decoration-primary/50 hover:decoration-primary line-clamp-1 flex items-center gap-1 mt-2"
                >
                  {new URL(bookmark.url).hostname}
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: new Date(bookmark.created_at).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
                  })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(bookmark.id)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                title="Delete bookmark"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

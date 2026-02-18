'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AddBookmarkForm } from '@/components/add-bookmark-form'
import { BookmarkList, Bookmark } from '@/components/bookmark-list'



interface DashboardViewProps {
    userId: string
}

export function DashboardView({ userId }: DashboardViewProps) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBookmarks = async () => {
            const supabase = createClient()
            try {
                const { data, error: fetchError } = await supabase
                    .from('bookmarks')
                    .select('*')
                    .eq('user_id', userId)
                    .order('created_at', { ascending: false })

                if (fetchError) throw fetchError
                setBookmarks(data || [])
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load bookmarks')
            } finally {
                setIsLoading(false)
            }
        }

        fetchBookmarks()
    }, [userId])

    useEffect(() => {
        const supabase = createClient()
        console.log('Subscribing to bookmarks for user:', userId)
        const channel = supabase
            .channel(`bookmarks:${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                    // filter: `user_id=eq.${userId}`, // Testing if filter is the issue
                },
                (payload) => {
                    console.log('Realtime event received:', payload)
                    if (payload.eventType === 'INSERT') {
                        console.log('INSERT event payload.new:', payload.new)
                        const newBookmark = payload.new as Bookmark
                        setBookmarks((prev) => {
                            if (prev.some((b) => b.id === newBookmark.id)) {
                                console.log('Bookmark already exists in state, skipping:', newBookmark.id)
                                return prev
                            }
                            console.log('Adding new bookmark to state:', newBookmark)
                            return [newBookmark, ...prev]
                        })
                    } else if (payload.eventType === 'DELETE') {
                        console.log('DELETE event payload.old:', payload.old)
                        const deletedBookmark = payload.old as Bookmark
                        setBookmarks((prev) => prev.filter((b) => b.id !== deletedBookmark.id))
                    }
                }
            )
            .subscribe((status) => {
                console.log('Subscription status:', status)
            })

        return () => {
            channel.unsubscribe()
        }
    }, [userId])

    const handleBookmarkAdded = useCallback((newBookmark: Bookmark) => {
        setBookmarks((prev) => {
            if (prev.some((b) => b.id === newBookmark.id)) {
                return prev
            }
            return [newBookmark, ...prev]
        })
    }, [])

    const handleDelete = useCallback(async (bookmarkId: string) => {
        setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId))

        const supabase = createClient()
        try {
            const { error: deleteError } = await supabase
                .from('bookmarks')
                .delete()
                .eq('id', bookmarkId)

            if (deleteError) {
                throw deleteError
            }
        } catch (err) {
            console.error('Failed to delete bookmark:', err)
        }
    }, [])

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <AddBookmarkForm userId={userId} onBookmarkAdded={handleBookmarkAdded} />
            </div>

            <div className="space-y-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Your Collection</h2>
                    <p className="text-muted-foreground">Manage and access your saved bookmarks.</p>
                </div>
                <BookmarkList
                    bookmarks={bookmarks}
                    isLoading={isLoading}
                    error={error}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    )
}

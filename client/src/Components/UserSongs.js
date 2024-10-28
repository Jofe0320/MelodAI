import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Music, Trash2, Plus } from 'lucide-react'

// come from an API or database
const mockSongs = [
  { id: 1, title: 'My First Song', duration: '3:45', createdAt: '2023-05-15' },
  { id: 2, title: 'Summer Vibes', duration: '4:20', createdAt: '2023-06-01' },
  { id: 3, title: 'Rainy Day Blues', duration: '5:10', createdAt: '2023-06-15' },
  { id: 4, title: 'Midnight Melody', duration: '3:30', createdAt: '2023-07-01' },
  { id: 5, title: 'Acoustic Dreams', duration: '2:55', createdAt: '2023-07-05' },
  { id: 6, title: 'Electric Sunset', duration: '4:10', createdAt: '2023-07-10' },
  { id: 7, title: 'Jazz Fusion', duration: '6:20', createdAt: '2023-07-15' },
  { id: 8, title: 'Rock Anthem', duration: '3:50', createdAt: '2023-07-20' },
]

export default function Component() {
  const [songs, setSongs] = useState(mockSongs)
  const [songToDelete, setSongToDelete] = useState(null)

  const deleteSong = (id) => {
    setSongs(songs.filter(song => song.id !== id))
    setSongToDelete(null)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Your Songs</h1>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add New Song
        </Button>
      </header>
      <main className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {songs.length === 0 ? (
              <p className="text-center text-muted-foreground col-span-full">You haven't created any songs yet.</p>
            ) : (
              songs.map((song) => (
                <Card key={song.id} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium truncate">{song.title}</CardTitle>
                    <Music className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-xs text-muted-foreground">Duration: {song.duration}</div>
                    <div className="text-xs text-muted-foreground">Created: {song.createdAt}</div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => setSongToDelete(song)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </main>
      <footer className="p-4 border-t">
        <p className="text-sm text-muted-foreground text-center">Total songs: {songs.length}</p>
      </footer>
      <Dialog open={songToDelete !== null} onOpenChange={() => setSongToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Song</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{songToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setSongToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteSong(songToDelete?.id)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
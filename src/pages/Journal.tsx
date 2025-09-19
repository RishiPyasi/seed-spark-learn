import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useEcoPoints } from '@/hooks/useEcoPoints';
import { BookOpen, Plus, Calendar, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  ecoActions: string[];
  date: Date;
  ecoPointsEarned: number;
}

const MOOD_OPTIONS = [
  { emoji: '😊', label: 'Happy', color: 'bg-green-100 text-green-800' },
  { emoji: '😌', label: 'Peaceful', color: 'bg-blue-100 text-blue-800' },
  { emoji: '🌟', label: 'Inspired', color: 'bg-yellow-100 text-yellow-800' },
  { emoji: '💚', label: 'Grateful', color: 'bg-emerald-100 text-emerald-800' },
  { emoji: '🤔', label: 'Thoughtful', color: 'bg-purple-100 text-purple-800' },
  { emoji: '😔', label: 'Concerned', color: 'bg-orange-100 text-orange-800' },
];

export const Journal = () => {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('eco-journal', []);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    mood: '😊',
    ecoActions: [] as string[]
  });
  const [showForm, setShowForm] = useState(false);
  const [newAction, setNewAction] = useState('');
  const { addPoints } = useEcoPoints();

  const addEcoAction = () => {
    if (newAction.trim()) {
      setNewEntry(prev => ({
        ...prev,
        ecoActions: [...prev.ecoActions, newAction.trim()]
      }));
      setNewAction('');
    }
  };

  const removeEcoAction = (index: number) => {
    setNewEntry(prev => ({
      ...prev,
      ecoActions: prev.ecoActions.filter((_, i) => i !== index)
    }));
  };

  const saveEntry = () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newEntry.title,
      content: newEntry.content,
      mood: newEntry.mood,
      ecoActions: newEntry.ecoActions,
      date: new Date(),
      ecoPointsEarned: newEntry.ecoActions.length * 2
    };

    setEntries(prev => [entry, ...prev]);
    addPoints(entry.ecoPointsEarned, `Journal entry: ${entry.title}`);
    
    setNewEntry({ title: '', content: '', mood: '😊', ecoActions: [] });
    setShowForm(false);
    toast.success(`Journal saved! +${entry.ecoPointsEarned} eco-points`);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast.success('Journal entry deleted');
  };

  return (
    <Layout currentUser={{ name: 'Eco Explorer', ecoPoints: 250, level: 3 }}>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">📖 Eco Journal</h1>
          <p className="text-muted-foreground">Reflect on your environmental journey and earn points!</p>
        </div>

        {/* Add New Entry */}
        <Card className="eco-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {showForm ? 'Write New Entry' : 'Start Writing'}
                </CardTitle>
                <CardDescription>
                  Share your environmental thoughts and actions (+2 points per eco-action)
                </CardDescription>
              </div>
              <Button onClick={() => setShowForm(!showForm)}>
                <Plus className="w-4 h-4 mr-2" />
                {showForm ? 'Cancel' : 'New Entry'}
              </Button>
            </div>
          </CardHeader>
          
          {showForm && (
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Entry Title</label>
                <input
                  type="text"
                  placeholder="Give your entry a title..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-border focus:border-eco-leaf focus:outline-none"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">How are you feeling?</label>
                <div className="flex flex-wrap gap-2">
                  {MOOD_OPTIONS.map((mood) => (
                    <button
                      key={mood.emoji}
                      onClick={() => setNewEntry(prev => ({ ...prev, mood: mood.emoji }))}
                      className={`px-3 py-2 rounded-lg border transition-all ${
                        newEntry.mood === mood.emoji 
                          ? 'border-eco-leaf bg-eco-leaf/10 scale-105' 
                          : 'border-border hover:border-eco-leaf'
                      }`}
                    >
                      <span className="mr-2">{mood.emoji}</span>
                      <span className="text-sm">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Your Thoughts</label>
                <Textarea
                  placeholder="What environmental actions did you take today? How did they make you feel? What did you learn?"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Eco-Actions Taken</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add an eco-action (e.g., 'Recycled plastic bottles')"
                    value={newAction}
                    onChange={(e) => setNewAction(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addEcoAction()}
                    className="flex-1 px-3 py-2 rounded-lg border border-border focus:border-eco-leaf focus:outline-none"
                  />
                  <Button onClick={addEcoAction} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {newEntry.ecoActions.map((action, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {action}
                      <button onClick={() => removeEcoAction(index)}>
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <Button onClick={saveEntry} className="w-full">
                <Star className="w-4 h-4 mr-2" />
                Save Entry (+{newEntry.ecoActions.length * 2} points)
              </Button>
            </CardContent>
          )}
        </Card>

        {/* Journal Entries */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Entries ({entries.length})</h2>
          
          {entries.length === 0 ? (
            <Card className="eco-card text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">No entries yet!</h3>
              <p className="text-muted-foreground mb-4">
                Start documenting your eco-journey and earn points for reflection.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => {
                const selectedMood = MOOD_OPTIONS.find(m => m.emoji === entry.mood);
                return (
                  <Card key={entry.id} className="eco-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 mb-1">
                            {entry.title}
                            {selectedMood && (
                              <Badge className={selectedMood.color}>
                                {selectedMood.emoji} {selectedMood.label}
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(entry.date).toLocaleDateString()}
                            <Badge className="eco-badge ml-2">
                              +{entry.ecoPointsEarned} points
                            </Badge>
                          </CardDescription>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteEntry(entry.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-3">{entry.content}</p>
                      {entry.ecoActions.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-2">Eco-Actions:</p>
                          <div className="flex flex-wrap gap-1">
                            {entry.ecoActions.map((action, index) => (
                              <Badge key={index} variant="outline">
                                🌱 {action}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
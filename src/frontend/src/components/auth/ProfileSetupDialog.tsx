import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { UserProfile } from '../../backend';

interface ProfileSetupDialogProps {
  open: boolean;
  onSave: (profile: UserProfile) => void;
  isSaving: boolean;
}

const EMOJI_OPTIONS = ['👤', '😊', '🎨', '🚀', '⭐', '🌟', '💎', '🔥', '✨', '🎯'];

export default function ProfileSetupDialog({ open, onSave, isSaving }: ProfileSetupDialogProps) {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJI_OPTIONS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave({ name: name.trim(), emoji: selectedEmoji });
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome! Set up your profile</DialogTitle>
          <DialogDescription>
            Choose a name and emoji to represent yourself in this private circle
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSaving}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Choose an Emoji</Label>
            <div className="grid grid-cols-5 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`text-3xl p-3 rounded-lg border-2 transition-all hover:scale-110 ${
                    selectedEmoji === emoji
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                  disabled={isSaving}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={!name.trim() || isSaving}>
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

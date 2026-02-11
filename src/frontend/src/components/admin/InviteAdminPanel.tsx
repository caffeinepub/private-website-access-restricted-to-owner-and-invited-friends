import { useState } from 'react';
import { useGetAllowlist, useAddAllowlistEntry, useRemoveAllowlistEntry } from '../../hooks/useAllowlistAdmin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { X, UserPlus, Users, AlertCircle, Trash2 } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

interface InviteAdminPanelProps {
  onClose: () => void;
}

export default function InviteAdminPanel({ onClose }: InviteAdminPanelProps) {
  const { data: allowlist = [], isLoading } = useGetAllowlist();
  const { mutate: addEntry, isPending: isAdding } = useAddAllowlistEntry();
  const { mutate: removeEntry, isPending: isRemoving } = useRemoveAllowlistEntry();
  const [principalInput, setPrincipalInput] = useState('');
  const [error, setError] = useState('');

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!principalInput.trim()) {
      setError('Please enter a Principal ID');
      return;
    }

    try {
      const principal = Principal.fromText(principalInput.trim());
      addEntry(principal, {
        onSuccess: () => {
          toast.success('User added to allowlist');
          setPrincipalInput('');
        },
        onError: (err) => {
          const errorMsg = err instanceof Error ? err.message : 'Failed to add user';
          setError(errorMsg);
          toast.error(errorMsg);
        },
      });
    } catch (err) {
      setError('Invalid Principal ID format');
    }
  };

  const handleRemoveEntry = (principal: Principal) => {
    if (confirm('Are you sure you want to remove this user from the allowlist?')) {
      removeEntry(principal, {
        onSuccess: () => {
          toast.success('User removed from allowlist');
        },
        onError: (err) => {
          const errorMsg = err instanceof Error ? err.message : 'Failed to remove user';
          toast.error(errorMsg);
        },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Admin Panel</h2>
          <p className="text-muted-foreground">Manage access to your private circle</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Add User Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Invite New Member
          </CardTitle>
          <CardDescription>
            Add a user to the allowlist by entering their Principal ID
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddEntry} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principal">Principal ID</Label>
              <Input
                id="principal"
                placeholder="Enter Principal ID (e.g., xxxxx-xxxxx-xxxxx-xxxxx-xxx)"
                value={principalInput}
                onChange={(e) => {
                  setPrincipalInput(e.target.value);
                  setError('');
                }}
                disabled={isAdding}
                className="font-mono text-sm"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isAdding || !principalInput.trim()}>
              {isAdding ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add to Allowlist
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Allowlist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Current Allowlist
          </CardTitle>
          <CardDescription>
            {allowlist.length} {allowlist.length === 1 ? 'user' : 'users'} with access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading allowlist...</p>
            </div>
          ) : allowlist.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No users in allowlist yet</p>
          ) : (
            <div className="space-y-2">
              {allowlist.map((principal, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-mono break-all">{principal.toString()}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveEntry(principal)}
                    disabled={isRemoving}
                    className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

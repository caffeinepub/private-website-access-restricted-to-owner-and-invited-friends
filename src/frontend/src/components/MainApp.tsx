import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthzStatus } from '../hooks/useAuthzStatus';
import { useGetCallerUserProfile, useGetAllProfiles } from '../hooks/useQueries';
import InviteAdminPanel from './admin/InviteAdminPanel';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { LogOut, Shield, Users } from 'lucide-react';
import { useState } from 'react';

export default function MainApp() {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { isAdmin } = useAuthzStatus();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: allProfiles = [] } = useGetAllProfiles();
  const [showAdmin, setShowAdmin] = useState(false);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const principal = identity?.getPrincipal().toString() || '';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Private Circle</h1>
                <p className="text-xs text-muted-foreground">Members Only</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Button
                  variant={showAdmin ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowAdmin(!showAdmin)}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {showAdmin && isAdmin ? (
          <InviteAdminPanel onClose={() => setShowAdmin(false)} />
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Welcome Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Welcome, {userProfile?.name || 'Friend'}! {userProfile?.emoji}</CardTitle>
                <CardDescription>
                  You're part of an exclusive circle. This is a private space for invited members only.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Your Principal ID</p>
                  <p className="text-xs font-mono break-all">{principal}</p>
                </div>
              </CardContent>
            </Card>

            {/* Members Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Circle Members
                </CardTitle>
                <CardDescription>
                  {allProfiles.length} {allProfiles.length === 1 ? 'member' : 'members'} in this private circle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {allProfiles.map((profile, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                    >
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                          {profile.emoji}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{profile.name}</p>
                        <p className="text-xs text-muted-foreground">Member</p>
                      </div>
                    </div>
                  ))}
                  {allProfiles.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No members yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} · Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

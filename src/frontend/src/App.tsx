import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import SignInScreen from './components/auth/SignInScreen';
import UnauthorizedScreen from './components/auth/UnauthorizedScreen';
import { useAuthzStatus } from './hooks/useAuthzStatus';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from './hooks/useQueries';
import MainApp from './components/MainApp';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';

export default function App() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { status: authzStatus, isLoading: authzLoading } = useAuthzStatus();
  const { data: userProfile, isLoading: profileLoading, isFetched: profileFetched } = useGetCallerUserProfile();
  const { mutate: saveProfile, isPending: savingProfile } = useSaveCallerUserProfile();

  const isAuthenticated = !!identity;

  // Show sign-in screen if not authenticated
  if (!isAuthenticated) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SignInScreen />
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show loading state while checking authorization
  if (authzLoading || profileLoading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show unauthorized screen if user is not allowed
  if (authzStatus === 'unauthorized') {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <UnauthorizedScreen onLogout={async () => {
          await clear();
          queryClient.clear();
        }} />
        <Toaster />
      </ThemeProvider>
    );
  }

  // Show profile setup if user doesn't have a profile yet
  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <MainApp />
      {showProfileSetup && (
        <ProfileSetupDialog
          open={showProfileSetup}
          onSave={(profile) => {
            saveProfile(profile);
          }}
          isSaving={savingProfile}
        />
      )}
      <Toaster />
    </ThemeProvider>
  );
}

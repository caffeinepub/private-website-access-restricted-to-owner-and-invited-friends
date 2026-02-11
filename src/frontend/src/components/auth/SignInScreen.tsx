import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Shield, Lock } from 'lucide-react';

export default function SignInScreen() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Image Section */}
        <div className="hidden lg:block">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/assets/generated/members-only-hero.dim_1600x900.png"
              alt="Members Only"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/assets/generated/lock-badge.dim_256x256.png"
                  alt="Lock"
                  className="w-12 h-12"
                />
                <h2 className="text-3xl font-bold text-white">Private Circle</h2>
              </div>
              <p className="text-white/90 text-lg">An exclusive space for invited members only</p>
            </div>
          </div>
        </div>

        {/* Sign In Card */}
        <div className="flex flex-col items-center justify-center">
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Private Circle</h1>
            <p className="text-muted-foreground">Members Only</p>
          </div>

          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in with Internet Identity to access this private space
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={login}
                disabled={isLoggingIn}
                className="w-full h-12 text-base"
                size="lg"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Sign In
                  </>
                )}
              </Button>

              <div className="pt-4 border-t border-border">
                <p className="text-xs text-center text-muted-foreground">
                  Only invited members can access this site. If you don't have access, please contact the owner.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

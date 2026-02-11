import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ShieldAlert, LogOut } from 'lucide-react';

interface UnauthorizedScreenProps {
  onLogout: () => void;
}

export default function UnauthorizedScreen({ onLogout }: UnauthorizedScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-destructive/5 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Image Section */}
        <div className="hidden lg:block">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl opacity-60">
            <img
              src="/assets/generated/members-only-hero.dim_1600x900.png"
              alt="Access Restricted"
              className="w-full h-auto grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="/assets/generated/lock-badge.dim_256x256.png"
                  alt="Lock"
                  className="w-12 h-12 opacity-50"
                />
                <h2 className="text-3xl font-bold text-white">Access Restricted</h2>
              </div>
            </div>
          </div>
        </div>

        {/* Unauthorized Card */}
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-md shadow-xl border-destructive/20">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
                <ShieldAlert className="w-8 h-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Access Denied</CardTitle>
              <CardDescription>
                You are not invited to this private site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                <p className="text-sm text-center">
                  This is a private members-only space. Only users who have been explicitly invited by the owner can access this site.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground text-center">
                  If you believe you should have access, please contact the site owner.
                </p>
              </div>

              <Button
                onClick={onLogout}
                variant="outline"
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

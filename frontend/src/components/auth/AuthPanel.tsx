import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { useGetCallerUserProfile } from '../../hooks/useAuthQueries';

export function AuthPanel() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      {isAuthenticated && userProfile && (
        <span className="text-sm text-muted-foreground">
          Welcome, <span className="font-medium text-foreground">{userProfile.name}</span>
        </span>
      )}
      <Button
        onClick={handleAuth}
        disabled={isLoggingIn}
        variant={isAuthenticated ? 'outline' : 'default'}
        size="sm"
      >
        {isLoggingIn ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : isAuthenticated ? (
          <>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </>
        )}
      </Button>
    </div>
  );
}

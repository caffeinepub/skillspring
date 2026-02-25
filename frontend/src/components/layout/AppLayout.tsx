import { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { AuthPanel } from '../auth/AuthPanel';
import { ProfileSetupDialog } from '../auth/ProfileSetupDialog';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useAuthQueries';
import { GraduationCap, MoreVertical, Share2, Link } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleShareWebsite = async () => {
    const shareData = {
      title: 'Student Information System',
      text: 'Manage student profiles, courses, enrollments, grades, and attendance all in one place.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err: unknown) {
        // User cancelled or share failed — fall back to copy
        if (err instanceof Error && err.name !== 'AbortError') {
          await copyToClipboard();
        }
      }
    } else {
      await copyToClipboard();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link.');
    }
  };

  const handleCopyLink = async () => {
    await copyToClipboard();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side: three-dot menu + logo + title */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-foreground"
                    aria-label="Open menu"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={handleShareWebsite} className="cursor-pointer gap-2">
                    <Share2 className="h-4 w-4" />
                    Share Website
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer gap-2">
                    <Link className="h-4 w-4" />
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-serif font-bold text-foreground">
                  Student Information System
                </h1>
              </div>
            </div>

            <AuthPanel />
          </div>
        </div>
      </header>

      {isAuthenticated && <Navigation />}

      <main className="container mx-auto px-4 py-8">
        {isAuthenticated ? children : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <GraduationCap className="h-24 w-24 text-muted-foreground mb-6" />
            <h2 className="text-3xl font-serif font-bold mb-4">Welcome to Student Information System</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Please log in to access student records, course management, enrollments, grades, and attendance tracking.
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-16 py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Student Information System. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      {showProfileSetup && <ProfileSetupDialog />}
    </div>
  );
}

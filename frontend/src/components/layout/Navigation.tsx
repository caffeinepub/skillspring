import { Link, useRouterState } from '@tanstack/react-router';
import { Home, FileText, Users, BookOpen, UserPlus, Award, Calendar, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/students', label: 'Students', icon: Users },
  { path: '/courses', label: 'Courses', icon: BookOpen },
  { path: '/instructors', label: 'Instructors', icon: GraduationCap },
  { path: '/enrollments', label: 'Enrollments', icon: UserPlus },
  { path: '/grades', label: 'Grades', icon: Award },
  { path: '/attendance', label: 'Attendance', icon: Calendar },
  { path: '/projects', label: 'Projects', icon: FileText },
];

export function Navigation() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  return (
    <nav className="border-b border-border bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap',
                  'border-b-2 -mb-px',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/50'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

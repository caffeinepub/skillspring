import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function EnrollmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-bold mb-2">Enrollments</h2>
        <p className="text-muted-foreground">
          Manage student course enrollments
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Backend Implementation Required</AlertTitle>
        <AlertDescription>
          Enrollment management features require backend operations to be implemented. 
          The frontend is ready and will work once the backend methods are added.
        </AlertDescription>
      </Alert>
    </div>
  );
}

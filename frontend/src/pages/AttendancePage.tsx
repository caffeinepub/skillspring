import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function AttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-bold mb-2">Attendance</h2>
        <p className="text-muted-foreground">
          Track student attendance for class sessions
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Backend Implementation Required</AlertTitle>
        <AlertDescription>
          Attendance tracking features require backend operations to be implemented. 
          The frontend is ready and will work once the backend methods are added.
        </AlertDescription>
      </Alert>
    </div>
  );
}

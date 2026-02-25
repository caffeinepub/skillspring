import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectStatistics } from './ProjectStatistics';
import { ProjectList } from './ProjectList';
import { AddProjectDialog } from './AddProjectDialog';
import { useGetProjectsByStudentId } from '../../hooks/useProjectQueries';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function ProjectManager() {
  const [studentId, setStudentId] = useState('');
  const [searchStudentId, setSearchStudentId] = useState('');
  const { data: projects, isLoading } = useGetProjectsByStudentId(searchStudentId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchStudentId(studentId);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Manage Projects & Assignments</CardTitle>
            <AddProjectDialog />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter student ID (e.g., STU001)"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </form>

          {isLoading && searchStudentId && (
            <p className="text-center text-muted-foreground py-8">
              Loading projects...
            </p>
          )}

          {!isLoading && searchStudentId && projects && projects.length > 0 && (
            <>
              <ProjectStatistics projects={projects} />
              <ProjectList projects={projects} />
            </>
          )}

          {!isLoading && searchStudentId && projects && projects.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No projects found for student ID: {searchStudentId}
            </p>
          )}

          {!searchStudentId && (
            <p className="text-center text-muted-foreground py-8">
              Enter a student ID to view their projects
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

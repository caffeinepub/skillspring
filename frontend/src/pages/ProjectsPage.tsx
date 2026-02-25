import { ProjectManager } from '../components/projects/ProjectManager';

export function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-serif font-bold mb-2">Projects & Assignments</h2>
        <p className="text-muted-foreground">
          Manage student project submissions and track grades
        </p>
      </div>

      <ProjectManager />
    </div>
  );
}

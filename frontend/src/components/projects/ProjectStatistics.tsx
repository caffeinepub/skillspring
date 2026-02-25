import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Award, CheckCircle, Clock } from 'lucide-react';
import type { Project } from '../../backend';

interface ProjectStatisticsProps {
  projects: Project[];
}

export function ProjectStatistics({ projects }: ProjectStatisticsProps) {
  const gradedProjects = projects.filter((p) => p.status === 'graded');
  const submittedProjects = projects.filter((p) => p.status === 'submitted');
  
  const averageGrade = gradedProjects.length > 0
    ? gradedProjects.reduce((sum, p) => sum + Number(p.grade), 0) / gradedProjects.length
    : 0;

  const stats = [
    { 
      label: 'Total Projects', 
      value: projects.length,
      icon: FileText,
      color: 'text-blue-600'
    },
    { 
      label: 'Average Grade', 
      value: averageGrade > 0 ? averageGrade.toFixed(1) : 'N/A',
      icon: Award,
      color: 'text-amber-600'
    },
    { 
      label: 'Submitted', 
      value: submittedProjects.length,
      icon: Clock,
      color: 'text-orange-600'
    },
    { 
      label: 'Graded', 
      value: gradedProjects.length,
      icon: CheckCircle,
      color: 'text-green-600'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon className={`h-4 w-4 ${stat.color}`} />
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

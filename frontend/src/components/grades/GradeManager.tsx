import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradeStatistics } from './GradeStatistics';
import { GradeList } from './GradeList';
import type { Grade } from '../../backend';

interface GradeManagerProps {
  grades: Grade[];
  onView: (grade: Grade) => void;
  onEdit: (grade: Grade) => void;
}

export function GradeManager({ grades, onView, onEdit }: GradeManagerProps) {
  const [studentFilter, setStudentFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  const filteredGrades = grades.filter(grade => {
    const matchesStudent = !studentFilter || grade.studentId.toLowerCase().includes(studentFilter.toLowerCase());
    const matchesCourse = !courseFilter || grade.courseCode.toLowerCase().includes(courseFilter.toLowerCase());
    return matchesStudent && matchesCourse;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="studentFilter">Filter by Student ID</Label>
          <Input
            id="studentFilter"
            placeholder="Enter student ID..."
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="courseFilter">Filter by Course Code</Label>
          <Input
            id="courseFilter"
            placeholder="Enter course code..."
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          />
        </div>
      </div>

      <GradeStatistics grades={filteredGrades} />

      <GradeList grades={filteredGrades} onView={onView} onEdit={onEdit} />
    </div>
  );
}

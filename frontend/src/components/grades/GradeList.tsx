import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye, Pencil, Search, AlertCircle } from 'lucide-react';
import type { Grade } from '../../backend';
import { isLateSubmission } from '../../hooks/useGradeQueries';

interface GradeListProps {
  grades: Grade[];
  onView: (grade: Grade) => void;
  onEdit: (grade: Grade) => void;
}

export function GradeList({ grades, onView, onEdit }: GradeListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGrades = grades.filter(grade =>
    grade.assignmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString();
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by assignment, student, or course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assignment</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGrades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No grades found
                </TableCell>
              </TableRow>
            ) : (
              filteredGrades.map((grade, index) => {
                const isLate = isLateSubmission(grade.submissionDate, grade.dueDate);
                return (
                  <TableRow key={`${grade.studentId}-${grade.courseCode}-${grade.assignment}-${index}`}>
                    <TableCell className="font-medium">{grade.assignmentName}</TableCell>
                    <TableCell>{grade.studentId}</TableCell>
                    <TableCell>{grade.courseCode}</TableCell>
                    <TableCell>
                      <span className={`font-bold ${getScoreColor(Number(grade.score))}`}>
                        {Number(grade.score)}%
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(grade.dueDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {formatDate(grade.submissionDate)}
                        {isLate && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Late
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onView(grade)}
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(grade)}
                          title="Edit grade"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

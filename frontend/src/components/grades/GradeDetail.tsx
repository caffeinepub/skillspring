import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, Award, MessageSquare, Pencil, AlertCircle } from 'lucide-react';
import type { Grade } from '../../backend';
import { isLateSubmission } from '../../hooks/useGradeQueries';

interface GradeDetailProps {
  grade: Grade;
  onEdit: () => void;
}

export function GradeDetail({ grade, onEdit }: GradeDetailProps) {
  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (score >= 80) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const isLate = isLateSubmission(grade.submissionDate, grade.dueDate);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-serif font-bold">{grade.assignmentName}</h3>
          <p className="text-muted-foreground">
            {grade.courseCode} - Student: {grade.studentId}
          </p>
        </div>
        <Button onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Assignment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Assignment Name</p>
              <p className="font-medium">{grade.assignmentName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Course Code</p>
              <p className="font-medium">{grade.courseCode}</p>
            </div>
          </div>
          {grade.description && (
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-1">{grade.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Submission Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="font-medium">{formatDate(grade.dueDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submission Date</p>
              <div className="flex items-center gap-2">
                <p className="font-medium">{formatDate(grade.submissionDate)}</p>
                {isLate && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Late
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`text-5xl font-bold px-6 py-3 rounded-lg ${getScoreColor(Number(grade.score))}`}>
              {Number(grade.score)}%
            </div>
            <div className="flex-1">
              <div className="w-full bg-muted rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all ${
                    Number(grade.score) >= 90 ? 'bg-green-500' :
                    Number(grade.score) >= 80 ? 'bg-blue-500' :
                    Number(grade.score) >= 70 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Number(grade.score)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {grade.instructorComments && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Instructor Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{grade.instructorComments}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

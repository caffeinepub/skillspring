import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Grade, Student, Course } from '../../backend';
import { Loader2 } from 'lucide-react';

interface GradeFormProps {
  grade?: Grade;
  students: Student[];
  courses: Course[];
  onSubmit: (grade: Grade) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function GradeForm({ grade, students, courses, onSubmit, onCancel, isLoading }: GradeFormProps) {
  const [formData, setFormData] = useState<Grade>(
    grade || {
      studentId: '',
      courseCode: '',
      assignment: '',
      score: BigInt(0),
      date: BigInt(Date.now() * 1000000),
      assignmentName: '',
      description: '',
      submissionDate: BigInt(Date.now() * 1000000),
      dueDate: BigInt(Date.now() * 1000000),
      instructorComments: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof Grade, value: string | bigint) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const dateToInput = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1000000).toISOString().split('T')[0];
  };

  const inputToDate = (dateString: string) => {
    return BigInt(new Date(dateString).getTime() * 1000000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Student & Course</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student *</Label>
              <Select
                value={formData.studentId}
                onValueChange={(value) => handleChange('studentId', value)}
                disabled={!!grade}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseCode">Course *</Label>
              <Select
                value={formData.courseCode}
                onValueChange={(value) => handleChange('courseCode', value)}
                disabled={!!grade}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.code} value={course.code}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assignmentName">Assignment Name *</Label>
            <Input
              id="assignmentName"
              value={formData.assignmentName}
              onChange={(e) => {
                handleChange('assignmentName', e.target.value);
                handleChange('assignment', e.target.value);
              }}
              required
              placeholder="e.g., Midterm Exam, Project 1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Assignment description and requirements"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submission Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score">Score *</Label>
              <Input
                id="score"
                type="number"
                min="0"
                max="100"
                value={Number(formData.score)}
                onChange={(e) => handleChange('score', BigInt(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={dateToInput(formData.dueDate)}
                onChange={(e) => handleChange('dueDate', inputToDate(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="submissionDate">Submission Date *</Label>
              <Input
                id="submissionDate"
                type="date"
                value={dateToInput(formData.submissionDate)}
                onChange={(e) => {
                  const newDate = inputToDate(e.target.value);
                  handleChange('submissionDate', newDate);
                  handleChange('date', newDate);
                }}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructor Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instructorComments">Comments</Label>
            <Textarea
              id="instructorComments"
              value={formData.instructorComments}
              onChange={(e) => handleChange('instructorComments', e.target.value)}
              placeholder="Feedback and comments for the student"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {grade ? 'Update Grade' : 'Add Grade'}
        </Button>
      </div>
    </form>
  );
}

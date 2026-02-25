import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Course } from '../../backend';
import { Loader2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CourseFormProps {
  course?: Course;
  onSubmit: (course: Course) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CourseForm({ course, onSubmit, onCancel, isLoading }: CourseFormProps) {
  const [formData, setFormData] = useState<Course>(
    course || {
      code: '',
      name: '',
      credits: BigInt(3),
      instructor: '',
      description: '',
      prerequisites: [],
      creditHours: BigInt(3),
      schedule: '',
      location: '',
    }
  );

  const [prerequisiteInput, setPrerequisiteInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof Course, value: string | bigint | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addPrerequisite = () => {
    if (prerequisiteInput.trim() && !formData.prerequisites.includes(prerequisiteInput.trim())) {
      handleChange('prerequisites', [...formData.prerequisites, prerequisiteInput.trim()]);
      setPrerequisiteInput('');
    }
  };

  const removePrerequisite = (code: string) => {
    handleChange('prerequisites', formData.prerequisites.filter(p => p !== code));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value)}
                required
                disabled={!!course}
                placeholder="e.g., CS101"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                placeholder="e.g., Introduction to Programming"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor *</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => handleChange('instructor', e.target.value)}
                required
                placeholder="Instructor name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credits *</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="12"
                value={Number(formData.credits)}
                onChange={(e) => {
                  handleChange('credits', BigInt(e.target.value));
                  handleChange('creditHours', BigInt(e.target.value));
                }}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Course description and objectives"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academic Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prerequisiteInput">Prerequisites</Label>
            <div className="flex gap-2">
              <Input
                id="prerequisiteInput"
                value={prerequisiteInput}
                onChange={(e) => setPrerequisiteInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                placeholder="Enter course code and press Enter"
              />
              <Button type="button" onClick={addPrerequisite} variant="secondary">
                Add
              </Button>
            </div>
            {formData.prerequisites.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.prerequisites.map((prereq) => (
                  <Badge key={prereq} variant="secondary" className="gap-1">
                    {prereq}
                    <button
                      type="button"
                      onClick={() => removePrerequisite(prereq)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schedule & Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule</Label>
              <Input
                id="schedule"
                value={formData.schedule}
                onChange={(e) => handleChange('schedule', e.target.value)}
                placeholder="e.g., Mon/Wed 10:00-11:30"
              />
              <p className="text-xs text-muted-foreground">Format: Days Time</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="e.g., Room 301, Building A"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {course ? 'Update Course' : 'Add Course'}
        </Button>
      </div>
    </form>
  );
}

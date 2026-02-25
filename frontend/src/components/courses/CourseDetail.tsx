import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, User, Award, Clock, MapPin, ListChecks, Pencil } from 'lucide-react';
import type { Course } from '../../backend';

interface CourseDetailProps {
  course: Course;
  onEdit: () => void;
}

export function CourseDetail({ course, onEdit }: CourseDetailProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-serif font-bold">{course.name}</h3>
          <p className="text-muted-foreground">Course Code: {course.code}</p>
        </div>
        <Button onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Course Code</p>
              <p className="font-medium">{course.code}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Course Name</p>
              <p className="font-medium">{course.name}</p>
            </div>
          </div>
          {course.description && (
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-1">{course.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Academic Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Credit Hours</p>
              <Badge variant="secondary" className="mt-1">
                {Number(course.creditHours)} credits
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Prerequisites</p>
              {course.prerequisites.length > 0 ? (
                <div className="flex flex-wrap gap-1 mt-1">
                  {course.prerequisites.map((prereq) => (
                    <Badge key={prereq} variant="outline">
                      {prereq}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm mt-1">None</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Instructor Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-sm text-muted-foreground">Instructor</p>
            <p className="font-medium">{course.instructor}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Schedule Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Schedule</p>
              <p className="font-medium flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {course.schedule || 'To be announced'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {course.location || 'To be announced'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

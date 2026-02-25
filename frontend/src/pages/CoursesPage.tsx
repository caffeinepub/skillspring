import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';
import { CourseList } from '../components/courses/CourseList';
import { CourseForm } from '../components/courses/CourseForm';
import { CourseDetail } from '../components/courses/CourseDetail';
import { useGetAllCourses, useAddCourse, useUpdateCourse, useDeleteCourse } from '../hooks/useCourseQueries';
import { toast } from 'sonner';
import type { Course } from '../backend';

export function CoursesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [editMode, setEditMode] = useState(false);

  const { data: courses = [], isLoading } = useGetAllCourses();
  const addCourse = useAddCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const handleAdd = () => {
    setSelectedCourse(null);
    setEditMode(false);
    setIsFormOpen(true);
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setEditMode(true);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleView = (course: Course) => {
    setSelectedCourse(course);
    setIsDetailOpen(true);
  };

  const handleSubmit = async (course: Course) => {
    try {
      if (editMode) {
        await updateCourse.mutateAsync(course);
        toast.success('Course updated successfully');
      } else {
        await addCourse.mutateAsync(course);
        toast.success('Course added successfully');
      }
      setIsFormOpen(false);
      setSelectedCourse(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save course');
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await deleteCourse.mutateAsync(code);
      toast.success('Course deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete course');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">Courses</h2>
          <p className="text-muted-foreground">
            Manage course catalog and instructor information
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <CourseList
          courses={courses}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Course' : 'Add New Course'}</DialogTitle>
          </DialogHeader>
          <CourseForm
            course={selectedCourse || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={addCourse.isPending || updateCourse.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Course Details</DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <CourseDetail
              course={selectedCourse}
              onEdit={() => handleEdit(selectedCourse)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

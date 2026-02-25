import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';
import { GradeManager } from '../components/grades/GradeManager';
import { GradeForm } from '../components/grades/GradeForm';
import { GradeDetail } from '../components/grades/GradeDetail';
import { useGetAllStudentGrades, useAddGrade, useUpdateGrade } from '../hooks/useGradeQueries';
import { useGetAllStudents } from '../hooks/useStudentQueries';
import { useGetAllCourses } from '../hooks/useCourseQueries';
import { toast } from 'sonner';
import type { Grade } from '../backend';

export function GradesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [studentId, setStudentId] = useState('');

  const { data: gradesByStudent = [], isLoading: gradesLoading } = useGetAllStudentGrades(studentId);
  const { data: students = [], isLoading: studentsLoading } = useGetAllStudents();
  const { data: courses = [], isLoading: coursesLoading } = useGetAllCourses();
  const addGrade = useAddGrade();
  const updateGrade = useUpdateGrade();

  const allGrades = gradesByStudent.flatMap(([_, grades]) => grades);

  const handleAdd = () => {
    setSelectedGrade(null);
    setEditMode(false);
    setIsFormOpen(true);
  };

  const handleEdit = (grade: Grade) => {
    setSelectedGrade(grade);
    setEditMode(true);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleView = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsDetailOpen(true);
  };

  const handleSubmit = async (grade: Grade) => {
    try {
      if (editMode) {
        await updateGrade.mutateAsync(grade);
        toast.success('Grade updated successfully');
      } else {
        await addGrade.mutateAsync(grade);
        toast.success('Grade added successfully');
      }
      setIsFormOpen(false);
      setSelectedGrade(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save grade');
    }
  };

  const isLoading = gradesLoading || studentsLoading || coursesLoading;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">Grades</h2>
          <p className="text-muted-foreground">
            Track student grades and performance
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Grade
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <GradeManager
          grades={allGrades}
          onView={handleView}
          onEdit={handleEdit}
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Grade' : 'Add New Grade'}</DialogTitle>
          </DialogHeader>
          <GradeForm
            grade={selectedGrade || undefined}
            students={students}
            courses={courses}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={addGrade.isPending || updateGrade.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Grade Details</DialogTitle>
          </DialogHeader>
          {selectedGrade && (
            <GradeDetail
              grade={selectedGrade}
              onEdit={() => handleEdit(selectedGrade)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

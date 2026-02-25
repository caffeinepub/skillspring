import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';
import { StudentList } from '../components/students/StudentList';
import { StudentForm } from '../components/students/StudentForm';
import { StudentDetail } from '../components/students/StudentDetail';
import { useGetAllStudents, useAddStudent, useUpdateStudent, useDeleteStudent } from '../hooks/useStudentQueries';
import { toast } from 'sonner';
import type { Student } from '../backend';

export function StudentsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editMode, setEditMode] = useState(false);

  const { data: students = [], isLoading } = useGetAllStudents();
  const addStudent = useAddStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const handleAdd = () => {
    setSelectedStudent(null);
    setEditMode(false);
    setIsFormOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setEditMode(true);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleView = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailOpen(true);
  };

  const handleSubmit = async (student: Student) => {
    try {
      if (editMode) {
        await updateStudent.mutateAsync(student);
        toast.success('Student updated successfully');
      } else {
        await addStudent.mutateAsync(student);
        toast.success('Student added successfully');
      }
      setIsFormOpen(false);
      setSelectedStudent(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save student');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
      await deleteStudent.mutateAsync(id);
      toast.success('Student deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete student');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">Students</h2>
          <p className="text-muted-foreground">
            Manage student records and information
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <StudentList
          students={students}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Student' : 'Add New Student'}</DialogTitle>
          </DialogHeader>
          <StudentForm
            student={selectedStudent || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={addStudent.isPending || updateStudent.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <StudentDetail
              student={selectedStudent}
              onEdit={() => handleEdit(selectedStudent)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

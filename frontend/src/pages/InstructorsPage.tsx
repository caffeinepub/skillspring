import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';
import { InstructorList } from '../components/instructors/InstructorList';
import { InstructorProfileForm } from '../components/instructors/InstructorProfileForm';
import { InstructorProfileView } from '../components/instructors/InstructorProfileView';
import { useGetAllInstructorProfiles, useAddInstructorProfile, useUpdateInstructorProfile } from '../hooks/useInstructorQueries';
import { useIsCallerAdmin } from '../hooks/useAuthQueries';
import { toast } from 'sonner';
import type { InstructorProfile } from '../backend';

export function InstructorsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<InstructorProfile | null>(null);
  const [editMode, setEditMode] = useState(false);

  const { data: instructors = [], isLoading } = useGetAllInstructorProfiles();
  const { data: isAdmin = false } = useIsCallerAdmin();
  const addProfile = useAddInstructorProfile();
  const updateProfile = useUpdateInstructorProfile();

  const handleAdd = () => {
    setSelectedProfile(null);
    setEditMode(false);
    setIsFormOpen(true);
  };

  const handleEdit = (profile: InstructorProfile) => {
    setSelectedProfile(profile);
    setEditMode(true);
    setIsViewOpen(false);
    setIsFormOpen(true);
  };

  const handleView = (profile: InstructorProfile) => {
    setSelectedProfile(profile);
    setIsViewOpen(true);
  };

  const handleSubmit = async (profile: InstructorProfile) => {
    try {
      if (editMode) {
        await updateProfile.mutateAsync(profile);
        toast.success('Instructor profile updated successfully');
      } else {
        await addProfile.mutateAsync(profile);
        toast.success('Instructor profile created successfully');
      }
      setIsFormOpen(false);
      setSelectedProfile(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save instructor profile');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">Instructors</h2>
          <p className="text-muted-foreground">
            Browse instructor profiles and contact information
          </p>
        </div>
        {isAdmin && (
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Add Instructor
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <InstructorList instructors={instructors} onView={handleView} />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editMode ? 'Edit Instructor Profile' : 'Add New Instructor'}</DialogTitle>
          </DialogHeader>
          <InstructorProfileForm
            profile={selectedProfile || undefined}
            onSubmit={handleSubmit}
            onCancel={() => setIsFormOpen(false)}
            isLoading={addProfile.isPending || updateProfile.isPending}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Instructor Profile</DialogTitle>
          </DialogHeader>
          {selectedProfile && (
            <InstructorProfileView
              profile={selectedProfile}
              onEdit={() => handleEdit(selectedProfile)}
              canEdit={isAdmin}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

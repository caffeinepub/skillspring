import { useState } from 'react';
import { useAddProject } from '../../hooks/useProjectQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ExternalBlob } from '../../backend';
import { FileText, Upload } from 'lucide-react';

interface ProjectFormProps {
  onSuccess: () => void;
}

export function ProjectForm({ onSuccess }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    studentId: '',
    title: '',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const addProject = useAddProject();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please select a PDF file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.studentId || !formData.title || !formData.description) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!selectedFile) {
      toast.error('Please select a PDF file');
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await addProject.mutateAsync({
        studentId: formData.studentId,
        title: formData.title,
        description: formData.description,
        pdf: blob,
      });

      toast.success('Project added successfully!');
      setUploadProgress(0);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add project');
      console.error(error);
      setUploadProgress(0);
    }
  };

  const isUploading = addProject.isPending && uploadProgress > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="studentId">Student ID *</Label>
        <Input
          id="studentId"
          value={formData.studentId}
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
          placeholder="e.g., STU001"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Project Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Final Year Project"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter project description"
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pdf">PDF File *</Label>
        <div className="flex items-center gap-2">
          <Input
            id="pdf"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="cursor-pointer"
            required
          />
        </div>
        {selectedFile && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <FileText className="h-4 w-4" />
            <span>{selectedFile.name}</span>
            <span className="text-xs">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={addProject.isPending}>
        {addProject.isPending ? (
          <>
            <Upload className="mr-2 h-4 w-4 animate-pulse" />
            Uploading Project...
          </>
        ) : (
          'Add Project'
        )}
      </Button>
    </form>
  );
}

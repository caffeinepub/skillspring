import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Project, ProjectStatus } from '../backend';
import { ExternalBlob } from '../backend';

export function useGetProjectsByStudentId(studentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Project[]>({
    queryKey: ['projects', studentId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProjectsByStudentId(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useGetProjectById(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Project | null>({
    queryKey: ['project', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProjectById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      studentId: string;
      title: string;
      description: string;
      pdf: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const id = crypto.randomUUID();
      await actor.addProject(id, data.studentId, data.title, data.description, data.pdf);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProjectGrade() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; grade: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateProjectGrade(data.id, data.grade);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProjectStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; status: ProjectStatus }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateProjectStatus(data.id, data.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

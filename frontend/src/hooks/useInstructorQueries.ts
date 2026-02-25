import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { InstructorProfile } from '../backend';

export function useGetAllInstructorProfiles() {
  const { actor, isFetching } = useActor();

  return useQuery<InstructorProfile[]>({
    queryKey: ['instructorProfiles'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInstructorProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetInstructorProfile(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<InstructorProfile | null>({
    queryKey: ['instructorProfile', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getInstructorProfile(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useAddInstructorProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: InstructorProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addInstructorProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructorProfiles'] });
    },
  });
}

export function useUpdateInstructorProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: InstructorProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateInstructorProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructorProfiles'] });
    },
  });
}

export function useDeleteInstructorProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteInstructorProfile(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instructorProfiles'] });
    },
  });
}

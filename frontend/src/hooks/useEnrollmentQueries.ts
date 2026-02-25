import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Note: These types match the backend Enrollment type structure
// Once backend is implemented, import from '../backend' instead
type Enrollment = {
  studentId: string;
  courseCode: string;
  enrollmentDate: bigint;
};

export function useGetAllEnrollments() {
  const { actor, isFetching } = useActor();

  return useQuery<Enrollment[]>({
    queryKey: ['enrollments'],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore - Backend method not yet implemented
      return actor.getAllEnrollments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetEnrollmentsByStudent(studentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Enrollment[]>({
    queryKey: ['enrollments', 'student', studentId],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore - Backend method not yet implemented
      return actor.getEnrollmentsByStudent(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useGetEnrollmentsByCourse(courseCode: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Enrollment[]>({
    queryKey: ['enrollments', 'course', courseCode],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore - Backend method not yet implemented
      return actor.getEnrollmentsByCourse(courseCode);
    },
    enabled: !!actor && !isFetching && !!courseCode,
  });
}

export function useEnrollStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { studentId: string; courseCode: string }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      await actor.enrollStudent(data.studentId, data.courseCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}

export function useDeleteEnrollment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { studentId: string; courseCode: string }) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      await actor.deleteEnrollment(data.studentId, data.courseCode);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}

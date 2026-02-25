import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Grade } from '../backend';

export function useGetAllStudentGrades(studentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<[string, Grade[]][]>({
    queryKey: ['grades', 'student', studentId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudentGrades(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useGetStudentGrades(studentId: string, courseCode: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Grade[]>({
    queryKey: ['grades', studentId, courseCode],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getStudentGrades(studentId, courseCode);
    },
    enabled: !!actor && !isFetching && !!studentId && !!courseCode,
  });
}

export function useAddGrade() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (grade: Grade) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addGrade(grade);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });
}

export function useUpdateGrade() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (grade: Grade) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateGrade(grade);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
    },
  });
}

export function calculateGradeStatistics(grades: Grade[]) {
  if (grades.length === 0) {
    return {
      totalAssignments: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
    };
  }

  const scores = grades.map(g => Number(g.score));
  const sum = scores.reduce((a, b) => a + b, 0);
  
  return {
    totalAssignments: grades.length,
    averageScore: Math.round(sum / grades.length),
    highestScore: Math.max(...scores),
    lowestScore: Math.min(...scores),
  };
}

export function isLateSubmission(submissionDate: bigint, dueDate: bigint): boolean {
  return submissionDate > dueDate;
}

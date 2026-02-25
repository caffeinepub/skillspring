import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Note: These types match the backend Attendance type structure
// Once backend is implemented, import from '../backend' instead
type Attendance = {
  studentId: string;
  courseCode: string;
  sessionDate: bigint;
  present: boolean;
};

type AttendanceStatistics = {
  totalSessions: bigint;
  sessionsAttended: bigint;
  sessionsMissed: bigint;
  attendanceRate: number;
};

export function useGetAttendanceByStudent(studentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Attendance[]>({
    queryKey: ['attendance', 'student', studentId],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore - Backend method not yet implemented
      return actor.getAttendanceByStudent(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useGetAttendanceByCourse(courseCode: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Attendance[]>({
    queryKey: ['attendance', 'course', courseCode],
    queryFn: async () => {
      if (!actor) return [];
      // @ts-ignore - Backend method not yet implemented
      return actor.getAttendanceByCourse(courseCode);
    },
    enabled: !!actor && !isFetching && !!courseCode,
  });
}

export function useRecordAttendance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (attendance: Omit<Attendance, 'sessionDate'>) => {
      if (!actor) throw new Error('Actor not available');
      // @ts-ignore - Backend method not yet implemented
      await actor.recordAttendance(attendance);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

export function useGetAttendanceStatistics(studentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<AttendanceStatistics>({
    queryKey: ['attendance', 'statistics', studentId],
    queryFn: async () => {
      if (!actor) {
        return {
          totalSessions: BigInt(0),
          sessionsAttended: BigInt(0),
          sessionsMissed: BigInt(0),
          attendanceRate: 0,
        };
      }
      // @ts-ignore - Backend method not yet implemented
      return actor.getAttendanceStatistics(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

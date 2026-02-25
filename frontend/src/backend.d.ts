import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Student {
    id: string;
    dob: string;
    major: string;
    name: string;
    year: bigint;
    email: string;
    address: string;
    emergencyContactPhone: string;
    emergencyContactName: string;
    enrollmentDate: Time;
    phone: string;
    emergencyContactRelationship: string;
    program: string;
}
export type Time = bigint;
export interface Attendance {
    studentId: string;
    sessionDate: Time;
    present: boolean;
    courseCode: string;
}
export interface Enrollment {
    studentId: string;
    enrollmentDate: Time;
    courseCode: string;
}
export interface InstructorProfile {
    id: string;
    bio: string;
    officeHours: string;
    name: string;
    email: string;
    officeLocation: string;
    phone: string;
    department: string;
}
export interface Course {
    credits: bigint;
    creditHours: bigint;
    prerequisites: Array<string>;
    instructor: string;
    code: string;
    name: string;
    description: string;
    schedule: string;
    location: string;
}
export interface Grade {
    studentId: string;
    instructorComments: string;
    assignment: string;
    assignmentName: string;
    date: Time;
    dueDate: Time;
    description: string;
    score: bigint;
    submissionDate: Time;
    courseCode: string;
}
export interface Project {
    id: string;
    pdf: ExternalBlob;
    status: ProjectStatus;
    title: string;
    studentId: string;
    description: string;
    grade: bigint;
    submissionDate: Time;
}
export interface UserProfile {
    studentId?: string;
    name: string;
    role: string;
}
export enum ProjectStatus {
    graded = "graded",
    submitted = "submitted",
    late = "late"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCourse(course: Course): Promise<void>;
    addGrade(grade: Grade): Promise<void>;
    addInstructorProfile(profile: InstructorProfile): Promise<void>;
    addProject(id: string, studentId: string, title: string, description: string, pdf: ExternalBlob): Promise<void>;
    addStudent(student: Student): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteCourse(courseCode: string): Promise<void>;
    deleteInstructorProfile(instructorId: string): Promise<void>;
    deleteStudent(studentId: string): Promise<void>;
    enrollStudent(studentId: string, courseCode: string): Promise<void>;
    getAllCourses(): Promise<Array<Course>>;
    getAllInstructorProfiles(): Promise<Array<InstructorProfile>>;
    getAllStudentGrades(studentId: string): Promise<Array<[string, Array<Grade>]>>;
    getAllStudents(): Promise<Array<Student>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCourse(courseCode: string): Promise<Course | null>;
    getInstructorProfile(instructorId: string): Promise<InstructorProfile | null>;
    getProjectById(id: string): Promise<Project | null>;
    getProjectsByStudentId(studentId: string): Promise<Array<Project>>;
    getStudent(studentId: string): Promise<Student | null>;
    getStudentAttendance(studentId: string, courseCode: string): Promise<Array<Attendance>>;
    getStudentEnrollments(studentId: string): Promise<Array<Enrollment>>;
    getStudentGrades(studentId: string, courseCode: string): Promise<Array<Grade>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordAttendance(att: Attendance): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCourse(course: Course): Promise<void>;
    updateGrade(grade: Grade): Promise<void>;
    updateInstructorProfile(profile: InstructorProfile): Promise<void>;
    updateProjectGrade(id: string, grade: bigint): Promise<void>;
    updateProjectStatus(id: string, status: ProjectStatus): Promise<void>;
    updateStudent(student: Student): Promise<void>;
}

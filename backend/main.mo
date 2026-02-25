import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Blob "mo:core/Blob";
import Storage "blob-storage/Storage";


import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";


actor {
  type Student = {
    id : Text;
    name : Text;
    email : Text;
    phone : Text;
    dob : Text;
    address : Text;
    program : Text;
    emergencyContactName : Text;
    emergencyContactPhone : Text;
    emergencyContactRelationship : Text;
    enrollmentDate : Time.Time;
    major : Text;
    year : Nat;
  };

  type Course = {
    code : Text;
    name : Text;
    credits : Nat;
    instructor : Text;
    description : Text;
    prerequisites : [Text];
    creditHours : Nat;
    schedule : Text;
    location : Text;
  };

  type Enrollment = {
    studentId : Text;
    courseCode : Text;
    enrollmentDate : Time.Time;
  };

  type Grade = {
    studentId : Text;
    courseCode : Text;
    assignment : Text;
    score : Nat;
    date : Time.Time;
    assignmentName : Text;
    description : Text;
    submissionDate : Time.Time;
    dueDate : Time.Time;
    instructorComments : Text;
  };

  type Attendance = {
    studentId : Text;
    courseCode : Text;
    sessionDate : Time.Time;
    present : Bool;
  };

  type InstructorProfile = {
    id : Text;
    name : Text;
    email : Text;
    phone : Text;
    department : Text;
    bio : Text;
    officeHours : Text;
    officeLocation : Text;
  };

  public type UserProfile = {
    name : Text;
    studentId : ?Text;
    role : Text;
  };

  public type ProjectStatus = {
    #submitted;
    #graded;
    #late;
  };

  public type Project = {
    id : Text;
    studentId : Text;
    title : Text;
    description : Text;
    submissionDate : Time.Time;
    grade : Nat;
    status : ProjectStatus;
    pdf : Storage.ExternalBlob;
  };

  let students = Map.empty<Text, Student>();
  let courses = Map.empty<Text, Course>();
  let enrollments = Map.empty<Text, [Enrollment]>();
  let grades = Map.empty<Text, [Grade]>();
  let attendance = Map.empty<Text, [Attendance]>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let instructorProfiles = Map.empty<Text, InstructorProfile>();
  let studentPrincipalMap = Map.empty<Text, Principal>();
  let projects = Map.empty<Text, Project>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  private func isStudentOrAdmin(caller : Principal, studentId : Text) : Bool {
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    switch (studentPrincipalMap.get(studentId)) {
      case (?principal) { Principal.equal(caller, principal) };
      case (null) { false };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
    switch (profile.studentId) {
      case (?sid) { studentPrincipalMap.add(sid, caller) };
      case (null) {};
    };
  };

  public shared ({ caller }) func addStudent(student : Student) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add students");
    };
    students.add(student.id, student);
  };

  public shared ({ caller }) func updateStudent(student : Student) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update students");
    };
    students.add(student.id, student);
  };

  public shared ({ caller }) func deleteStudent(studentId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete students");
    };
    students.remove(studentId);
  };

  public query ({ caller }) func getStudent(studentId : Text) : async ?Student {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view student information");
    };
    if (not isStudentOrAdmin(caller, studentId)) {
      Runtime.trap("Unauthorized: Can only view your own student information");
    };
    students.get(studentId);
  };

  public query ({ caller }) func getAllStudents() : async [Student] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all students");
    };
    students.values().toArray();
  };

  public shared ({ caller }) func addCourse(course : Course) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add courses");
    };
    courses.add(course.code, course);
  };

  public shared ({ caller }) func updateCourse(course : Course) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update courses");
    };
    courses.add(course.code, course);
  };

  public shared ({ caller }) func deleteCourse(courseCode : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete courses");
    };
    courses.remove(courseCode);
  };

  public query ({ caller }) func getCourse(courseCode : Text) : async ?Course {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view courses");
    };
    courses.get(courseCode);
  };

  public query ({ caller }) func getAllCourses() : async [Course] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view courses");
    };
    courses.values().toArray();
  };

  public shared ({ caller }) func enrollStudent(studentId : Text, courseCode : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can enroll students");
    };
    let enrollment : Enrollment = {
      studentId;
      courseCode;
      enrollmentDate = Time.now();
    };
    switch (enrollments.get(studentId)) {
      case (null) { enrollments.add(studentId, [enrollment]) };
      case (?existing) {
        let updated = existing.concat([enrollment]);
        enrollments.add(studentId, updated);
      };
    };
  };

  public query ({ caller }) func getStudentEnrollments(studentId : Text) : async [Enrollment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view enrollments");
    };
    if (not isStudentOrAdmin(caller, studentId)) {
      Runtime.trap("Unauthorized: Can only view your own enrollments");
    };
    switch (enrollments.get(studentId)) {
      case (null) { [] };
      case (?enr) { enr };
    };
  };

  public shared ({ caller }) func addGrade(grade : Grade) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add grades");
    };
    let key = grade.studentId # "-" # grade.courseCode;
    switch (grades.get(key)) {
      case (null) { grades.add(key, [grade]) };
      case (?existing) {
        let updated = existing.concat([grade]);
        grades.add(key, updated);
      };
    };
  };

  public shared ({ caller }) func updateGrade(grade : Grade) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update grades");
    };
    let key = grade.studentId # "-" # grade.courseCode;
    switch (grades.get(key)) {
      case (null) { grades.add(key, [grade]) };
      case (?existing) {
        let filtered = existing.filter(func(g) { g.assignment != grade.assignment });
        let updated = filtered.concat([grade]);
        grades.add(key, updated);
      };
    };
  };

  public query ({ caller }) func getStudentGrades(studentId : Text, courseCode : Text) : async [Grade] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view grades");
    };
    if (not isStudentOrAdmin(caller, studentId)) {
      Runtime.trap("Unauthorized: Can only view your own grades");
    };
    let key = studentId # "-" # courseCode;
    switch (grades.get(key)) {
      case (null) { [] };
      case (?grd) { grd };
    };
  };

  public query ({ caller }) func getAllStudentGrades(studentId : Text) : async [(Text, [Grade])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view grades");
    };
    if (not isStudentOrAdmin(caller, studentId)) {
      Runtime.trap("Unauthorized: Can only view your own grades");
    };
    let allGrades = grades.entries().toArray();
    let studentGrades = allGrades.filter(func((key, _)) { key.startsWith(#text(studentId # "-")) });
    studentGrades;
  };

  public shared ({ caller }) func recordAttendance(att : Attendance) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can record attendance");
    };
    let key = att.studentId # "-" # att.courseCode;
    switch (attendance.get(key)) {
      case (null) { attendance.add(key, [att]) };
      case (?existing) {
        let updated = existing.concat([att]);
        attendance.add(key, updated);
      };
    };
  };

  public query ({ caller }) func getStudentAttendance(studentId : Text, courseCode : Text) : async [Attendance] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view attendance");
    };
    if (not isStudentOrAdmin(caller, studentId)) {
      Runtime.trap("Unauthorized: Can only view your own attendance");
    };
    let key = studentId # "-" # courseCode;
    switch (attendance.get(key)) {
      case (null) { [] };
      case (?att) { att };
    };
  };

  public shared ({ caller }) func addInstructorProfile(profile : InstructorProfile) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add instructor profiles");
    };
    instructorProfiles.add(profile.id, profile);
  };

  public shared ({ caller }) func updateInstructorProfile(profile : InstructorProfile) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update instructor profiles");
    };
    instructorProfiles.add(profile.id, profile);
  };

  public shared ({ caller }) func deleteInstructorProfile(instructorId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete instructor profiles");
    };
    instructorProfiles.remove(instructorId);
  };

  public query ({ caller }) func getInstructorProfile(instructorId : Text) : async ?InstructorProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view instructor profiles");
    };
    instructorProfiles.get(instructorId);
  };

  public query ({ caller }) func getAllInstructorProfiles() : async [InstructorProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view instructor profiles");
    };
    instructorProfiles.values().toArray();
  };

  public shared ({ caller }) func addProject(
    id : Text,
    studentId : Text,
    title : Text,
    description : Text,
    pdf : Storage.ExternalBlob,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add projects");
    };
    if (not isStudentOrAdmin(caller, studentId)) {
      Runtime.trap("Unauthorized: Can only add your own projects");
    };
    let project : Project = {
      id;
      studentId;
      title;
      description;
      submissionDate = Time.now();
      grade = 0;
      status = #submitted;
      pdf;
    };
    projects.add(id, project);
  };

  public query ({ caller }) func getProjectsByStudentId(studentId : Text) : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };
    if (not isStudentOrAdmin(caller, studentId)) {
      Runtime.trap("Unauthorized: Can only view your own projects");
    };
    let allProjects = projects.values().toArray();
    let studentProjects = allProjects.filter(
      func(p) { p.studentId == studentId }
    );
    studentProjects;
  };

  public query ({ caller }) func getProjectById(id : Text) : async ?Project {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };
    switch (projects.get(id)) {
      case (null) { null };
      case (?project) {
        if (not isStudentOrAdmin(caller, project.studentId)) {
          Runtime.trap("Unauthorized: Can only view your own projects");
        };
        ?project;
      };
    };
  };

  public shared ({ caller }) func updateProjectGrade(id : Text, grade : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update project grades");
    };
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        let updatedProject = { project with grade; status = #graded };
        projects.add(id, updatedProject);
      };
    };
  };

  public shared ({ caller }) func updateProjectStatus(id : Text, status : ProjectStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update project status");
    };
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        let updatedProject = { project with status };
        projects.add(id, updatedProject);
      };
    };
  };
};

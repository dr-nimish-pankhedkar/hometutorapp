/** People in the demo. Safe to import on the client — no credentials here (see lib/auth.ts). */

export type Role = "student" | "faculty";

export interface StudentProfile {
  id: string;
  firstName: string;
  fullName: string;
  initials: string;
  grade: string;
  target: string;
  city: string;
  tutor: string;
}

export interface FacultyProfile {
  id: string;
  firstName: string;
  fullName: string;
  initials: string;
  subject: string;
  credential: string;
}

/** The student who can log in. Their results are the real ones taken in this browser. */
export const student: StudentProfile = {
  id: "aarav",
  firstName: "Aarav",
  fullName: "Aarav Sharma",
  initials: "AS",
  grade: "Class 12",
  target: "JEE Main 2027",
  city: "Pune",
  tutor: "Dr. Nimish Pankhedkar",
};

/** The faculty member who can log in. */
export const faculty: FacultyProfile = {
  id: "nimish",
  firstName: "Nimish",
  fullName: "Dr. Nimish Pankhedkar",
  initials: "NP",
  subject: "Chemistry",
  credential: "PhD, IIT Bombay",
};

/** Other students in Dr. Pankhedkar's Chemistry batch — demo profiles with generated results. */
export const otherStudents: StudentProfile[] = [
  { id: "priya", firstName: "Priya", fullName: "Priya Nair", initials: "PN", grade: "Class 12", target: "NEET 2027", city: "Pune", tutor: faculty.fullName },
  { id: "rohan", firstName: "Rohan", fullName: "Rohan Kulkarni", initials: "RK", grade: "Class 12", target: "JEE Advanced 2027", city: "Pune", tutor: faculty.fullName },
  { id: "sneha", firstName: "Sneha", fullName: "Sneha Patil", initials: "SP", grade: "Class 11", target: "NEET 2028", city: "Pune", tutor: faculty.fullName },
  { id: "kabir", firstName: "Kabir", fullName: "Kabir Mehta", initials: "KM", grade: "Class 11", target: "JEE Main 2028", city: "Pune", tutor: faculty.fullName },
];

export const homeFor: Record<Role, string> = { student: "/dashboard", faculty: "/faculty" };

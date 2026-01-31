import { Student, Teacher, SchoolClass, ScheduleEvent } from "./types";

export const MOCK_STUDENTS: Student[] = [
    { id: "ST-001", name: "Alice Johnson", grade: "10th", classMatch: "A", email: "alice.j@school.edu", status: "Active" },
    { id: "ST-002", name: "Bob Smith", grade: "10th", classMatch: "B", email: "bob.s@school.edu", status: "Active" },
    { id: "ST-003", name: "Charlie Brown", grade: "11th", classMatch: "A", email: "charlie.b@school.edu", status: "Absent" },
    { id: "ST-004", name: "Diana Prince", grade: "9th", classMatch: "C", email: "diana.p@school.edu", status: "Active" },
    { id: "ST-005", name: "Evan Wright", grade: "12th", classMatch: "B", email: "evan.w@school.edu", status: "Suspended" },
];

export const MOCK_TEACHERS: Teacher[] = [
    { id: 1, name: "Dr. Sarah Wilson", subject: "Mathematics", email: "s.wilson@edu.com", classesCount: 5, studentsCount: 140 },
    { id: 2, name: "Mr. James Bond", subject: "Physics", email: "j.bond@edu.com", classesCount: 4, studentsCount: 120 },
    { id: 3, name: "Ms. Emily Blunt", subject: "English Literature", email: "e.blunt@edu.com", classesCount: 6, studentsCount: 160 },
    { id: 4, name: "Mrs. Linda Parker", subject: "Biology", email: "l.parker@edu.com", classesCount: 4, studentsCount: 115 },
    { id: 5, name: "Mr. Robert Downey", subject: "Chemistry", email: "r.downey@edu.com", classesCount: 5, studentsCount: 135 },
    { id: 6, name: "Ms. Natasha R.", subject: "History", email: "n.romanoff@edu.com", classesCount: 3, studentsCount: 95 },
];

export const MOCK_CLASSES: SchoolClass[] = [
    { id: 1, name: "Mathematics 101", grade: "Grade 10", teacherName: "Dr. Sarah Wilson", studentsCount: 32, time: "09:00 AM", progress: 65, color: "bg-blue-500" },
    { id: 2, name: "Physics Lab", grade: "Grade 11", teacherName: "Mr. James Bond", studentsCount: 28, time: "11:00 AM", progress: 40, color: "bg-purple-500" },
    { id: 3, name: "English Lit", grade: "Grade 9", teacherName: "Ms. Emily Blunt", studentsCount: 35, time: "01:00 PM", progress: 80, color: "bg-pink-500" },
    { id: 4, name: "Biology", grade: "Grade 12", teacherName: "Mrs. Linda Parker", studentsCount: 30, time: "10:30 AM", progress: 55, color: "bg-green-500" },
    { id: 5, name: "Chemistry", grade: "Grade 10", teacherName: "Mr. Robert Downey", studentsCount: 29, time: "02:00 PM", progress: 25, color: "bg-yellow-500" },
];

export const MOCK_SCHEDULE: ScheduleEvent[] = [
    { day: "Mon", time: "09:00 AM", subject: "Mathematics", teacher: "Dr. Wilson", duration: 1, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800" },
    { day: "Mon", time: "11:00 AM", subject: "Physics", teacher: "Mr. Bond", duration: 1, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800" },
    { day: "Tue", time: "10:00 AM", subject: "Chemistry", teacher: "Mr. Downey", duration: 2, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800" },
    { day: "Wed", time: "09:00 AM", subject: "English", teacher: "Ms. Blunt", duration: 1, color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800" },
    { day: "Thu", time: "08:00 AM", subject: "Biology", teacher: "Mrs. Parker", duration: 1, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800" },
    { day: "Fri", time: "11:00 AM", subject: "History", teacher: "Ms. Natasha", duration: 1, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800" },
];

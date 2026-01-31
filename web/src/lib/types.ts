export type AttendanceStatus = "Present" | "Absent" | "Late" | "Excused";

export interface AttendanceRecord {
    studentId: string;
    status: AttendanceStatus;
    remarks?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'teacher' | 'student' | 'parent';
    avatar?: string;
}

export interface Student {
    id: string;
    name: string;
    email: string;
    grade: string;
    classMatch: string; // "10th - A"
    status: 'Active' | 'Absent' | 'Suspended';
    avatar?: string;
}

export interface Teacher {
    id: number | string;
    name: string;
    email: string;
    subject: string;
    classesCount: number;
    studentsCount: number;
    avatar?: string;
}

export interface SchoolClass {
    id: number | string;
    name: string;
    grade: string;
    teacherId?: string;
    teacherName: string;
    studentsCount: number;
    time: string; // e.g. "09:00 AM"
    days?: string[]; // ["Mon", "Wed"]
    room?: string;
    color: string; // "bg-blue-500" or similar
    progress: number;
}

export interface ScheduleEvent {
    day: string;
    time: string; // "09:00 AM"
    subject: string;
    teacher: string;
    room?: string;
    duration?: number; // in hours or slots
    color: string; // Tailwind primitive class "bg-blue-100"
}

export interface DashboardStats {
    totalStudents: number;
    totalTeachers: number;
    totalClasses: number;
    attendanceRate: number; // Percentage
}

export interface ActivityItem {
    id: string;
    user: string;
    action: string;
    target: string;
    time: string;
    avatar?: string;
}

// --- Grades / Results ---
export interface Exam {
    id: string;
    title: string;          // e.g. "Midterm Exam", "Finals"
    classId: string;
    subject: string;
    date: string;
    totalMarks: number;
}

export interface ExamResult {
    id: string;
    examId: string;
    studentId: string;
    studentName: string;
    marksObtained: number;
    grade: string;          // "A", "B", "C"...
    remarks?: string;
}

// --- Fees / Finance ---
export interface FeeRecord {
    id: string;
    studentId: string;
    studentName: string;
    type: string;           // "Tuition", "Transport", "Library"
    amount: number;
    dueDate: string;
    status: 'Paid' | 'Pending' | 'Overdue';
}

export interface PaymentTransaction {
    id: string;
    feeId: string;
    amountPaid: number;
    date: string;
    method: 'Cash' | 'Card' | 'Online';
}

// --- Notifications ---
export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'alert';
    timestamp: string;
    read: boolean;
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: string;
}

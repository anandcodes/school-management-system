import { Student, Teacher, SchoolClass, ScheduleEvent, User, DashboardStats, ActivityItem } from "@/lib/types";
import { MOCK_STUDENTS, MOCK_TEACHERS, MOCK_CLASSES, MOCK_SCHEDULE } from "@/lib/mock";

const DELAY = 800; // Simulated network delay

export const api = {
    getStudents: async (): Promise<Student[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([...MOCK_STUDENTS]), DELAY));
    },
    getTeachers: async (): Promise<Teacher[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([...MOCK_TEACHERS]), DELAY));
    },
    getClasses: async (): Promise<SchoolClass[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([...MOCK_CLASSES]), DELAY));
    },
    getSchedule: async (): Promise<ScheduleEvent[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([...MOCK_SCHEDULE]), DELAY));
    },
    getDashboardStats: async (): Promise<DashboardStats> => {
        return new Promise((resolve) => setTimeout(() => resolve({
            totalStudents: MOCK_STUDENTS.length,
            totalTeachers: MOCK_TEACHERS.length,
            totalClasses: MOCK_CLASSES.length,
            attendanceRate: 94.5
        }), DELAY));
    },
    getActivities: async (): Promise<ActivityItem[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([
            { id: "1", user: "Dr. Sarah Wilson", action: "uploaded", target: "Math 101 Assignment", time: "2 mins ago" },
            { id: "2", user: "Admin", action: "added", target: "New Student: John Doe", time: "1 hour ago" },
            { id: "3", user: "Ms. Emily Blunt", action: "posted", target: "English Syllabus", time: "3 hours ago" },
            { id: "4", user: "System", action: "generated", target: "Weekly Report", time: "5 hours ago" },
        ]), DELAY));
    },
    getStudentsByClass: async (classId: string): Promise<Student[]> => {
        // In a real app, filtering would happen on the server.
        // For now, we return a random subset of students to simulate class enrollment,
        // or just return all students since our mock data doesn't explicitly link them deeply.
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_STUDENTS), DELAY));
    },
    saveAttendance: async (classId: string, date: Date, records: any[]): Promise<boolean> => {
        console.log(`Saving attendance for class ${classId} on ${date.toDateString()}`, records);
        return new Promise((resolve) => setTimeout(() => resolve(true), DELAY));
    },

    // --- Grades ---
    getExams: async (classId?: string): Promise<import("@/lib/types").Exam[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([
            { id: "1", title: "Midterm Exam 2023", classId: "1", subject: "Mathematics", date: "2023-10-15", totalMarks: 100 },
            { id: "2", title: "Unit Test 1", classId: "1", subject: "Physics", date: "2023-09-20", totalMarks: 50 },
            { id: "3", title: "Finals 2023", classId: "2", subject: "English", date: "2023-12-10", totalMarks: 100 },
        ]), DELAY));
    },
    getExamResults: async (examId: string): Promise<import("@/lib/types").ExamResult[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([
            { id: "101", examId, studentId: "ST-001", studentName: "Alice Johnson", marksObtained: 85, grade: "A" },
            { id: "102", examId, studentId: "ST-002", studentName: "Bob Smith", marksObtained: 72, grade: "B" },
            { id: "103", examId, studentId: "ST-003", studentName: "Charlie Brown", marksObtained: 91, grade: "A+" },
        ]), DELAY));
    },
    saveExamResults: async (examId: string, results: import("@/lib/types").ExamResult[]): Promise<boolean> => {
        console.log(`Saving results for exam ${examId}`, results);
        return new Promise((resolve) => setTimeout(() => resolve(true), DELAY));
    },
    getExamById: async (examId: string): Promise<import("@/lib/types").Exam | undefined> => {
        const exams = [
            { id: "1", title: "Midterm Exam 2023", classId: "1", subject: "Mathematics", date: "2023-10-15", totalMarks: 100 },
            { id: "2", title: "Unit Test 1", classId: "1", subject: "Physics", date: "2023-09-20", totalMarks: 50 },
            { id: "3", title: "Finals 2023", classId: "2", subject: "English", date: "2023-12-10", totalMarks: 100 },
        ];
        return new Promise((resolve) => setTimeout(() => resolve(exams.find(e => e.id === examId)), DELAY));
    },

    // --- Fees ---
    getFeeRecords: async (): Promise<import("@/lib/types").FeeRecord[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([
            { id: "F-001", studentId: "ST-001", studentName: "Alice Johnson", type: "Tuition Fee - Term 1", amount: 1200, dueDate: "2023-09-01", status: "Paid" },
            { id: "F-002", studentId: "ST-002", studentName: "Bob Smith", type: "Tuition Fee - Term 1", amount: 1200, dueDate: "2023-09-01", status: "Pending" },
            { id: "F-003", studentId: "ST-003", studentName: "Charlie Brown", type: "Transport Fee", amount: 300, dueDate: "2023-09-05", status: "Overdue" },
            { id: "F-004", studentId: "ST-004", studentName: "Diana Prince", type: "Library Fine", amount: 15, dueDate: "2023-10-10", status: "Pending" },
        ]), DELAY));
    },
    payFee: async (feeId: string): Promise<boolean> => {
        console.log(`Paying fee ${feeId}`);
        return new Promise((resolve) => setTimeout(() => resolve(true), DELAY));
    },

    // --- Notifications ---
    getNotifications: async (): Promise<import("@/lib/types").NotificationItem[]> => {
        return new Promise((resolve) => setTimeout(() => resolve([
            { id: "N-1", title: "Staff Meeting", message: "All staff meeting at 3 PM in the Conference Room.", type: 'info', timestamp: '2 hours ago', read: false },
            { id: "N-2", title: "System Maintenance", message: "Server downtime scheduled for Saturday 10 PM.", type: 'warning', timestamp: '1 day ago', read: true },
            { id: "N-3", title: "Fee Reminders Sent", message: "Automated fee reminders have been sent to 45 parents.", type: 'success', timestamp: '2 days ago', read: true },
        ]), DELAY));
    },
    markNotificationAsRead: async (id: string): Promise<boolean> => {
        console.log(`Notification ${id} marked as read`);
        return new Promise((resolve) => setTimeout(() => resolve(true), DELAY));
    },

    login: async (email: string, password: string): Promise<User> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (password !== "password") {
                    reject(new Error("Invalid credentials"));
                    return;
                }

                if (email === "admin@school.edu") {
                    resolve({
                        id: "ADMIN-01",
                        name: "Administrator",
                        email: email,
                        role: "admin",
                        avatar: "https://github.com/shadcn.png"
                    });
                } else if (email === "teacher@school.edu") {
                    resolve({
                        id: "TEACHER-01",
                        name: "John Teacher",
                        email: email,
                        role: "teacher",
                        avatar: "https://github.com/shadcn.png"
                    });
                } else if (email === "student@school.edu") {
                    resolve({
                        id: "ST-001",
                        name: "Alice Student",
                        email: email,
                        role: "student",
                        avatar: "https://github.com/shadcn.png"
                    });
                } else if (email === "parent@school.edu") {
                    resolve({
                        id: "P-001",
                        name: "Bob Parent",
                        email: email,
                        role: "parent",
                        avatar: "https://github.com/shadcn.png"
                    });
                } else {
                    reject(new Error("Invalid credentials"));
                }
            }, 1000);
        });
    }
};

import { Student, Teacher, SchoolClass, ScheduleEvent, User, DashboardStats, ActivityItem, Exam, ExamResult, FeeRecord, NotificationItem } from "@/lib/types";
import { MOCK_STUDENTS, MOCK_TEACHERS, MOCK_CLASSES, MOCK_SCHEDULE } from "@/lib/mock";

export const api = {
    getStudents: async (): Promise<Student[]> => {
        try {
            const res = await fetch('/api/students');
            if (res.ok) return await res.json();
        } catch (e) { console.error(e); }
        return MOCK_STUDENTS; // Fallback
    },
    getStudentsPaginated: async (page: number, limit: number, search?: string, status?: string): Promise<{ data: Student[], meta: any }> => {
        try {
            const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
            if (search) params.append('search', search);
            if (status && status !== 'All') params.append('status', status);

            const res = await fetch(`/api/students?${params.toString()}`);
            if (res.ok) return await res.json();
        } catch (e) { console.error(e); }
        return { data: MOCK_STUDENTS, meta: { total: MOCK_STUDENTS.length, page, limit, totalPages: 1 } };
    },
    getTeachers: async (): Promise<Teacher[]> => {
        try {
            const res = await fetch('/api/teachers');
            if (res.ok) return await res.json();
        } catch (e) { console.error(e); }
        return MOCK_TEACHERS; // Fallback
    },
    getTeachersPaginated: async (page: number, limit: number, search?: string): Promise<{ data: Teacher[], meta: any }> => {
        try {
            const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
            if (search) params.append('search', search);

            const res = await fetch(`/api/teachers?${params.toString()}`);
            if (res.ok) return await res.json();
        } catch (e) { console.error(e); }
        return { data: MOCK_TEACHERS, meta: { total: MOCK_TEACHERS.length, page, limit, totalPages: 1 } };
    },
    getClasses: async (): Promise<SchoolClass[]> => {
        try {
            const res = await fetch('/api/classes');
            if (res.ok) return await res.json();
        } catch (e) { console.error(e); }
        return MOCK_CLASSES; // Fallback
    },
    getClassesPaginated: async (page: number, limit: number, search?: string): Promise<{ data: SchoolClass[], meta: any }> => {
        try {
            const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
            if (search) params.append('search', search);

            const res = await fetch(`/api/classes?${params.toString()}`);
            if (res.ok) return await res.json();
        } catch (e) { console.error(e); }
        return { data: MOCK_CLASSES, meta: { total: MOCK_CLASSES.length, page, limit, totalPages: 1 } };
    },
    getSchedule: async (): Promise<ScheduleEvent[]> => {
        try {
            const res = await fetch('/api/schedule');
            if (res.ok) return await res.json();
        } catch (e) { console.error(e); }
        return MOCK_SCHEDULE; // Fallback
    },
    getDashboardStats: async (): Promise<DashboardStats> => {
        try {
            const res = await fetch('/api/dashboard');
            if (res.ok) return await res.json();
        } catch (e) { console.error(e); }
        return {
            totalStudents: MOCK_STUDENTS.length,
            totalTeachers: MOCK_TEACHERS.length,
            totalClasses: MOCK_CLASSES.length,
            attendanceRate: 95.2
        };
    },
    getActivities: async (): Promise<ActivityItem[]> => {
        return [
            { id: "1", user: "Dr. Sarah Wilson", action: "uploaded", target: "Math 101 Assignment", time: "2 mins ago" },
            { id: "2", user: "Admin", action: "added", target: "New Student: John Doe", time: "1 hour ago" },
        ];
    },
    getStudentsByClass: async (classId: string): Promise<Student[]> => {
        try {
            const students = await api.getStudents();
            return students;
        } catch (e) { return MOCK_STUDENTS; }
    },
    saveAttendance: async (classId: string, date: Date, records: any[]): Promise<boolean> => {
        try {
            await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classId, date, attendance: records }),
            });
            return true;
        } catch (e) { return true; }
    },

    // --- Grades ---
    getExams: async (classId?: string): Promise<Exam[]> => {
        try {
            const res = await fetch('/api/exams');
            if (res.ok) return await res.json();
        } catch (e) { }
        return [
            { id: "1", title: "Midterm Exam 2023", classId: "1", subject: "Mathematics", date: "2023-10-15", totalMarks: 100 },
        ];
    },
    getExamsPaginated: async (page: number, limit: number, search?: string): Promise<{ data: Exam[], meta: any }> => {
        try {
            const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
            if (search) params.append('search', search);

            const res = await fetch(`/api/exams?${params.toString()}`);
            if (res.ok) return await res.json();
        } catch (e) { console.error(e); }
        // Return structured mock
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    },
    getExamResults: async (examId: string): Promise<ExamResult[]> => {
        return [];
    },
    saveExamResults: async (examId: string, results: ExamResult[]): Promise<boolean> => {
        return true;
    },
    getExamById: async (examId: string): Promise<Exam | undefined> => {
        const exams = await api.getExams();
        return exams.find(e => e.id === examId);
    },

    // --- Fees ---
    getFeeRecords: async (): Promise<FeeRecord[]> => {
        try {
            const res = await fetch('/api/fees');
            if (res.ok) return await res.json();
        } catch (e) { }
        return [
            { id: "F-001", studentId: "ST-001", studentName: "Alice Johnson", type: "Tuition Fee", amount: 1200, dueDate: "2023-09-01", status: "Paid" },
        ];
    },
    getFeesPaginated: async (page: number, limit: number, search?: string, status?: string): Promise<{ data: FeeRecord[], meta: any }> => {
        try {
            const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
            if (search) params.append('search', search);
            if (status && status !== 'All') params.append('status', status);

            const res = await fetch(`/api/fees?${params.toString()}`);
            if (res.ok) return await res.json();
        } catch (e) { console.error(e); }
        return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    },
    payFee: async (feeId: string): Promise<boolean> => {
        return true;
    },

    // --- Notifications ---
    getNotifications: async (): Promise<NotificationItem[]> => {
        try {
            const res = await fetch('/api/notifications');
            if (res.ok) return await res.json();
        } catch (e) { }
        return [
            { id: "N-1", title: "Welcome", message: "Welcome to the new system!", type: 'info', timestamp: 'Now', read: false },
        ];
    },
    markNotificationAsRead: async (id: string): Promise<boolean> => {
        return true;
    },

    login: async (email: string, password: string): Promise<User> => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Login failed');
        }

        return res.json();
    },

    getMessages: async (userId: string): Promise<import("@/lib/types").Message[]> => {
        try {
            const res = await fetch(`/api/messages?userId=${userId}`);
            if (res.ok) return await res.json();
        } catch (e) { }
        return [];
    },

    sendMessage: async (senderId: string, receiverId: string, content: string): Promise<boolean> => {
        try {
            await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderId, receiverId, content }),
            });
            return true;
        } catch (e) { return true; }
    },

    // --- Update/Delete Operations ---
    updateStudent: async (id: string, data: Partial<Student>): Promise<Student> => {
        const res = await fetch(`/api/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update student');
        return res.json();
    },

    deleteStudent: async (id: string): Promise<boolean> => {
        const res = await fetch(`/api/students/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete student');
        return true;
    },

    updateTeacher: async (id: string, data: Partial<Teacher>): Promise<Teacher> => {
        const res = await fetch(`/api/teachers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update teacher');
        return res.json();
    },

    deleteTeacher: async (id: string): Promise<boolean> => {
        const res = await fetch(`/api/teachers/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete teacher');
        return true;
    },

    updateClass: async (id: string, data: Partial<SchoolClass>): Promise<SchoolClass> => {
        const res = await fetch(`/api/classes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update class');
        return res.json();
    },

    deleteClass: async (id: string): Promise<boolean> => {
        const res = await fetch(`/api/classes/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete class');
        return true;
    },
};

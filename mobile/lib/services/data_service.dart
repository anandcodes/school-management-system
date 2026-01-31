import 'dart:async';
import '../models/student.dart';
import '../models/teacher.dart';
import '../models/school_class.dart';
import '../models/schedule_event.dart';
import '../models/new_models.dart';
import 'package:flutter/material.dart';

class DataService {
  // Singleton pattern
  static final DataService _instance = DataService._internal();
  factory DataService() => _instance;
  DataService._internal();

  // Mock Data
  final List<Student> _students = [
    Student(
        id: "ST-001",
        name: "Alice Johnson",
        grade: "10th",
        classMatch: "A",
        email: "alice@school.edu",
        status: "Active"),
    Student(
        id: "ST-002",
        name: "Bob Smith",
        grade: "10th",
        classMatch: "B",
        email: "bob@school.edu",
        status: "Active"),
    Student(
        id: "ST-003",
        name: "Charlie Brown",
        grade: "11th",
        classMatch: "A",
        email: "charlie@school.edu",
        status: "Absent"),
    Student(
        id: "ST-004",
        name: "Diana Prince",
        grade: "9th",
        classMatch: "C",
        email: "diana@school.edu",
        status: "Active"),
    Student(
        id: "ST-005",
        name: "Evan Wright",
        grade: "12th",
        classMatch: "B",
        email: "evan@school.edu",
        status: "Suspended"),
  ];

  final List<Teacher> _teachers = [
    Teacher(
        id: "1",
        name: "Dr. Sarah Wilson",
        subject: "Mathematics",
        email: "s.wilson@edu.com",
        classesCount: 5,
        studentsCount: 140),
    Teacher(
        id: "2",
        name: "Mr. James Bond",
        subject: "Physics",
        email: "j.bond@edu.com",
        classesCount: 4,
        studentsCount: 120),
    Teacher(
        id: "3",
        name: "Ms. Emily Blunt",
        subject: "English Lit",
        email: "e.blunt@edu.com",
        classesCount: 6,
        studentsCount: 160),
  ];

  final List<SchoolClass> _classes = [
    SchoolClass(
        id: "1",
        name: "Mathematics 101",
        grade: "Grade 10",
        teacherName: "Dr. Sarah Wilson",
        studentsCount: 32,
        time: "09:00 AM",
        color: Colors.blue,
        progress: 0.65),
    SchoolClass(
        id: "2",
        name: "Physics Lab",
        grade: "Grade 11",
        teacherName: "Mr. James Bond",
        studentsCount: 28,
        time: "11:00 AM",
        color: Colors.purple,
        progress: 0.4),
    SchoolClass(
        id: "3",
        name: "English Lit",
        grade: "Grade 9",
        teacherName: "Ms. Emily Blunt",
        studentsCount: 35,
        time: "01:00 PM",
        color: Colors.pink,
        progress: 0.8),
  ];

  Future<List<Student>> getStudents() async {
    await Future.delayed(const Duration(milliseconds: 800));
    return _students;
  }

  void addStudent(Student student) {
    _students.add(student);
  }

  Future<List<Teacher>> getTeachers() async {
    await Future.delayed(const Duration(milliseconds: 800));
    return _teachers;
  }

  void addTeacher(Teacher teacher) {
    _teachers.add(teacher);
  }

  Future<List<SchoolClass>> getClasses() async {
    await Future.delayed(const Duration(milliseconds: 800));
    return _classes;
  }

  void addClass(SchoolClass cls) {
    _classes.add(cls);
  }

  Future<List<Student>> getStudentsByClass(String classId) async {
    await Future.delayed(const Duration(milliseconds: 600));
    // For MOCK purposes, return all students or a random subset
    // In a real app, filtering happens here
    return _students;
  }

  Future<void> saveAttendance(
      String classId, DateTime date, Map<String, String> attendance) async {
    await Future.delayed(const Duration(milliseconds: 800));
  }

  Future<List<ScheduleEvent>> getSchedule() async {
    await Future.delayed(const Duration(milliseconds: 800));
    return [
      ScheduleEvent(
          day: "Mon",
          time: "09:00 AM",
          subject: "Math",
          teacher: "Dr. Wilson",
          room: "302",
          color: Colors.blue),
      ScheduleEvent(
          day: "Mon",
          time: "11:00 AM",
          subject: "Physics",
          teacher: "Mr. Bond",
          room: "Lab A",
          color: Colors.purple),
      ScheduleEvent(
          day: "Tue",
          time: "10:00 AM",
          subject: "Chem",
          teacher: "Mr. Downey",
          room: "Lab B",
          color: Colors.orange),
      ScheduleEvent(
          day: "Wed",
          time: "09:00 AM",
          subject: "English",
          teacher: "Ms. Blunt",
          room: "204",
          color: Colors.pink),
      ScheduleEvent(
          day: "Thu",
          time: "08:00 AM",
          subject: "Biology",
          teacher: "Mrs. Parker",
          room: "305",
          color: Colors.green),
      ScheduleEvent(
          day: "Fri",
          time: "11:00 AM",
          subject: "History",
          teacher: "Ms. Natasha",
          room: "102",
          color: Colors.deepOrange),
    ];
  }

  Future<Map<String, dynamic>> getDashboardStats() async {
    await Future.delayed(const Duration(milliseconds: 800));
    return {
      'totalStudents': _students.length, // Dynamic based on list
      'totalTeachers': _teachers.length,
      'totalClasses': _classes.length,
      'attendanceRate': 95.2
    };
  }

  Future<List<Map<String, String>>> getActivities() async {
    await Future.delayed(const Duration(milliseconds: 600));
    return [
      {
        "user": "Sarah Smith",
        "action": "submitted assignment",
        "target": "Math 101",
        "time": "2m ago"
      },
      {
        "user": "Admin",
        "action": "added",
        "target": "New Student",
        "time": "1h ago"
      },
      {
        "user": "Ms. Blunt",
        "action": "updated",
        "target": "Syllabus",
        "time": "3h ago"
      },
    ];
  }

  // --- New Features Methods ---

  Future<List<Exam>> getExams() async {
    await Future.delayed(const Duration(milliseconds: 800));
    return [
      Exam(
          id: "1",
          title: "Midterm Exam 2023",
          subject: "Mathematics",
          date: "2023-10-15",
          totalMarks: 100),
      Exam(
          id: "2",
          title: "Unit Test 1",
          subject: "Physics",
          date: "2023-09-20",
          totalMarks: 50),
      Exam(
          id: "3",
          title: "Finals 2023",
          subject: "English",
          date: "2023-12-10",
          totalMarks: 100),
    ];
  }

  Future<List<ExamResult>> getExamResults(String examId) async {
    await Future.delayed(const Duration(milliseconds: 800));
    return [
      ExamResult(
          id: "101",
          examId: examId,
          studentId: "ST-001",
          studentName: "Alice Johnson",
          marksObtained: 85,
          grade: "A"),
      ExamResult(
          id: "102",
          examId: examId,
          studentId: "ST-002",
          studentName: "Bob Smith",
          marksObtained: 72,
          grade: "B"),
      ExamResult(
          id: "103",
          examId: examId,
          studentId: "ST-003",
          studentName: "Charlie Brown",
          marksObtained: 91,
          grade: "A+"),
    ];
  }

  Future<void> saveExamResults(String examId, List<ExamResult> results) async {
    await Future.delayed(const Duration(milliseconds: 800));
    // In a real app, this would send data to the backend
    print("Saved results for exam $examId");
  }

  Future<List<FeeRecord>> getFees() async {
    await Future.delayed(const Duration(milliseconds: 800));
    return [
      FeeRecord(
          id: "F-001",
          studentName: "Alice Johnson",
          type: "Tuition Fee - Term 1",
          amount: 1200,
          dueDate: "2023-09-01",
          status: "Paid"),
      FeeRecord(
          id: "F-002",
          studentName: "Bob Smith",
          type: "Tuition Fee - Term 1",
          amount: 1200,
          dueDate: "2023-09-01",
          status: "Pending"),
      FeeRecord(
          id: "F-003",
          studentName: "Charlie Brown",
          type: "Transport Fee",
          amount: 300,
          dueDate: "2023-09-05",
          status: "Overdue"),
      FeeRecord(
          id: "F-004",
          studentName: "Diana Prince",
          type: "Library Fine",
          amount: 15,
          dueDate: "2023-10-10",
          status: "Pending"),
    ];
  }

  Future<void> payFee(String feeId) async {
    await Future.delayed(const Duration(milliseconds: 800));
    print("Paid fee $feeId");
  }

  Future<List<NotificationItem>> getNotifications() async {
    await Future.delayed(const Duration(milliseconds: 800));
    return [
      NotificationItem(
          id: "N-1",
          title: "Staff Meeting",
          message: "All staff meeting at 3 PM.",
          time: '2h ago',
          type: 'info'),
      NotificationItem(
          id: "N-2",
          title: "System Maintenance",
          message: "Server downtime scheduled.",
          time: '1d ago',
          type: 'warning'),
      NotificationItem(
          id: "N-3",
          title: "Fee Reminders",
          message: "Fee reminders sent.",
          time: '2d ago',
          type: 'success'),
    ];
  }

  Future<void> markNotificationAsRead(String id) async {
    await Future.delayed(const Duration(milliseconds: 400));
    print("Notification $id marked as read");
  }
}

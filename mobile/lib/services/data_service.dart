import 'dart:async';
import '../models/student.dart';
import '../models/teacher.dart';
import '../models/school_class.dart';
import '../models/schedule_event.dart';
import '../models/new_models.dart';
import 'package:flutter/material.dart';
import 'api_service.dart';

class DataService {
  // Singleton pattern
  static final DataService _instance = DataService._internal();
  factory DataService() => _instance;

  late final ApiService _apiService;

  DataService._internal() {
    // TODO: REPLACE THIS URL with your actual Vercel Deployment URL for the live app
    // Example: "https://school-management-system-ten.vercel.app"
    // For Android Emulator (Local): "http://10.0.2.2:3000"
    const String baseUrl = "https://school-management-system.vercel.app";
    _apiService = ApiService(baseUrl: baseUrl);
  }

  // Cache/State
  List<Student> _students = [];
  List<Teacher> _teachers = [];
  List<SchoolClass> _classes = [];

  Future<List<Student>> getStudents() async {
    try {
      _students = await _apiService.getStudents();
      return _students;
    } catch (e) {
      print("Error fetching students: $e");
      return []; // Return empty or cached
    }
  }

  void addStudent(Student student) {
    // TODO: Implement API POST
    _students.add(student);
  }

  Future<List<Teacher>> getTeachers() async {
    try {
      _teachers = await _apiService.getTeachers();
      return _teachers;
    } catch (e) {
      print("Error fetching teachers: $e");
      return [];
    }
  }

  void addTeacher(Teacher teacher) {
    _teachers.add(teacher);
  }

  Future<List<SchoolClass>> getClasses() async {
    try {
      _classes = await _apiService.getClasses();
      return _classes;
    } catch (e) {
      print("Error fetching classes: $e");
      return [];
    }
  }

  void addClass(SchoolClass cls) {
    _classes.add(cls);
  }

  Future<List<Student>> getStudentsByClass(String classId) async {
    // In real app, API should filter. For now, filter local list.
    if (_students.isEmpty) await getStudents();
    return _students; // Simplified for now
  }

  Future<void> saveAttendance(
      String classId, DateTime date, Map<String, String> attendance) async {
    // Mock save
  }

  Future<List<ScheduleEvent>> getSchedule() async {
    try {
      return await _apiService.getSchedule();
    } catch (e) {
      print("Error fetching schedule: $e");
      return [];
    }
  }

  Future<Map<String, dynamic>> getDashboardStats() async {
    try {
      return await _apiService.getDashboardStats();
    } catch (e) {
      print("Error fetching stats: $e");
      return {
        'totalStudents': 0,
        'totalTeachers': 0,
        'totalClasses': 0,
        'attendanceRate': 0
      };
    }
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
    try {
      return await _apiService.getExams();
    } catch (e) {
      print("Error fetching exams: $e");
      return [];
    }
  }

  Future<List<ExamResult>> getExamResults(String examId) async {
    // Note: Assuming we fetch specific results or filter client side for now.
    // Ideally, add getExamResults(examId) to ApiService.
    await Future.delayed(const Duration(milliseconds: 800));
    return []; // Placeholder until API endpoint exists
  }

  Future<void> saveExamResults(String examId, List<ExamResult> results) async {
    // TODO: Implement API POST
  }

  Future<List<FeeRecord>> getFees() async {
    try {
      return await _apiService.getFees();
    } catch (e) {
      print("Error fetching fees: $e");
      return [];
    }
  }

  Future<void> payFee(String feeId) async {
    // TODO: Implement API POST
    await Future.delayed(const Duration(milliseconds: 800));
  }

  Future<List<NotificationItem>> getNotifications() async {
    try {
      return await _apiService.getNotifications();
    } catch (e) {
      print("Error fetching notifications: $e");
      return [];
    }
  }

  Future<void> markNotificationAsRead(String id) async {
    // TODO: Implement API POST
    await Future.delayed(const Duration(milliseconds: 400));
  }
}

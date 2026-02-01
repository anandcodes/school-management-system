import 'dart:async';
import '../models/student.dart';
import '../models/teacher.dart';
import '../models/school_class.dart';
import '../models/schedule_event.dart';
import '../models/new_models.dart';
import 'api_service.dart';

class DataService {
  // Singleton pattern
  static final DataService _instance = DataService._internal();
  factory DataService() => _instance;

  late final ApiService _apiService;

  DataService._internal() {
    // Production Vercel URL
    // NOTE: Ensure "Deployment Protection" is DISABLED in Vercel Project Settings > Deployment Protection
    // otherwise the app will get 401 Unauthorized errors.
    const String baseUrl =
        "https://school-management-system-anandcodes-projects.vercel.app";
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

  Future<void> addStudent(Student student) async {
    try {
      await _apiService.createStudent(student);
      _students.add(student); // Optimistic update or refresh
    } catch (e) {
      print("Error adding student: $e");
    }
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

  Future<void> addTeacher(Teacher teacher) async {
    try {
      await _apiService.createTeacher(teacher);
      _teachers.add(teacher);
    } catch (e) {
      print("Error adding teacher: $e");
    }
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

  Future<void> addClass(SchoolClass cls) async {
    try {
      await _apiService.createClass(cls);
      _classes.add(cls);
    } catch (e) {
      print("Error adding class: $e");
    }
  }

  Future<List<Student>> getStudentsByClass(String classId) async {
    // In real app, API should filter. For now, filter local list.
    if (_students.isEmpty) await getStudents();
    return _students; // Simplified for now
  }

  Future<void> saveAttendance(
      String classId, DateTime date, Map<String, String> attendance) async {
    try {
      await _apiService.saveAttendance(classId, date, attendance);
    } catch (e) {
      print("Error saving attendance: $e");
    }
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
    try {
      await _apiService.payFee(feeId);
    } catch (e) {
      print("Error paying fee: $e");
    }
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
    try {
      await _apiService.markNotificationAsRead(id);
    } catch (e) {
      print("Error marking notification read: $e");
    }
  }

  Future<List<Message>> getMessages(String userId) async {
    try {
      return await _apiService.getMessages(userId);
    } catch (e) {
      print("Error fetching messages: $e");
      return [];
    }
  }

  Future<void> sendMessage(
      String senderId, String receiverId, String content) async {
    try {
      await _apiService.sendMessage(senderId, receiverId, content);
    } catch (e) {
      print("Error sending message: $e");
      rethrow;
    }
  }
}

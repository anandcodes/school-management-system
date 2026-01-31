import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/student.dart';
import '../models/teacher.dart';
import '../models/school_class.dart';
import '../models/schedule_event.dart';
import '../models/new_models.dart';

class ApiService {
  // TODO: Replace with your actual Vercel URL or http://10.0.2.2:3000 for local Android emulator
  final String baseUrl;

  ApiService({required this.baseUrl});

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/api/login'),
        body: jsonEncode({'email': email, 'password': password}),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to login: ${response.body}');
      }
    } catch (e) {
      throw Exception('Connection error: $e');
    }
  }

  Future<List<Student>> getStudents() async {
    final response = await http.get(Uri.parse('$baseUrl/api/students'));
    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      return body.map((dynamic item) => Student.fromJson(item)).toList();
    } else {
      throw Exception('Failed to load students');
    }
  }

  Future<List<Teacher>> getTeachers() async {
    final response = await http.get(Uri.parse('$baseUrl/api/teachers'));
    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      return body.map((dynamic item) => Teacher.fromJson(item)).toList();
    } else {
      throw Exception('Failed to load teachers');
    }
  }

  Future<List<SchoolClass>> getClasses() async {
    final response = await http.get(Uri.parse('$baseUrl/api/classes'));
    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      return body.map((dynamic item) => SchoolClass.fromJson(item)).toList();
    } else {
      throw Exception('Failed to load classes');
    }
  }

  Future<List<ScheduleEvent>> getSchedule() async {
    final response = await http.get(Uri.parse('$baseUrl/api/schedule'));
    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      return body.map((dynamic item) => ScheduleEvent.fromJson(item)).toList();
    } else {
      throw Exception('Failed to load schedule');
    }
  }

  Future<Map<String, dynamic>> getDashboardStats() async {
    final response = await http.get(Uri.parse('$baseUrl/api/dashboard'));
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load stats');
    }
  }

  Future<List<Exam>> getExams() async {
    final response = await http.get(Uri.parse('$baseUrl/api/exams'));
    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      return body.map((dynamic item) => Exam.fromJson(item)).toList();
    } else {
      throw Exception('Failed to load exams');
    }
  }

  Future<List<FeeRecord>> getFees() async {
    final response = await http.get(Uri.parse('$baseUrl/api/fees'));
    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      return body.map((dynamic item) => FeeRecord.fromJson(item)).toList();
    } else {
      throw Exception('Failed to load fees');
    }
  }

  Future<List<NotificationItem>> getNotifications() async {
    final response = await http.get(Uri.parse('$baseUrl/api/notifications'));
    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      return body
          .map((dynamic item) => NotificationItem.fromJson(item))
          .toList();
    } else {
      throw Exception('Failed to load notifications');
    }
  }

  Future<void> saveAttendance(
      String classId, DateTime date, Map<String, String> attendance) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/attendance'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'classId': classId,
        'date': date.toIso8601String(),
        'attendance': attendance,
      }),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to save attendance');
    }
  }

  Future<void> createStudent(Student student) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/students'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(student.toJson()),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to create student: ${response.body}');
    }
  }

  Future<void> createTeacher(Teacher teacher) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/teachers'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(teacher.toJson()),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to create teacher: ${response.body}');
    }
  }

  Future<void> createClass(SchoolClass cls) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/classes'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode(cls.toJson()),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to create class: ${response.body}');
    }
  }

  Future<void> payFee(String feeId) async {
    // Note: requires backend implementation
    // final response = await http.post...
  }

  Future<void> markNotificationAsRead(String id) async {
    // Note: requires backend implementation
    // final response = await http.post...
  }
  Future<List<Message>> getMessages(String userId) async {
    final response =
        await http.get(Uri.parse('$baseUrl/api/messages?userId=$userId'));
    if (response.statusCode == 200) {
      List<dynamic> body = jsonDecode(response.body);
      return body.map((dynamic item) => Message.fromJson(item)).toList();
    } else {
      print('GET MESSAGES FAILED: ${response.statusCode} - ${response.body}');
      throw Exception('Failed to load messages: ${response.statusCode}');
    }
  }

  Future<void> sendMessage(
      String senderId, String receiverId, String content) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/messages'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'senderId': senderId,
        'receiverId': receiverId,
        'content': content,
      }),
    );
    if (response.statusCode != 200) {
      throw Exception('Failed to send message: ${response.body}');
    }
  }
}

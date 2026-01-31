import 'package:flutter/material.dart';

class SchoolClass {
  final String id;
  final String name;
  final String grade;
  final String teacherName;
  final int studentsCount;
  final String time;
  final Color color;
  final double progress;

  SchoolClass({
    required this.id,
    required this.name,
    required this.grade,
    required this.teacherName,
    required this.studentsCount,
    required this.time,
    required this.color,
    this.progress = 0.0,
  });
  factory SchoolClass.fromJson(Map<String, dynamic> json) {
    return SchoolClass(
      id: json['id'].toString(),
      name: json['name'] ?? '',
      grade: json['grade'] ?? '',
      teacherName: json['teacherName'] ?? 'Unassigned',
      studentsCount: json['studentsCount'] ?? 0,
      time: json['time'] ?? '09:00 AM',
      color: _parseColor(json['color']),
      progress: 0.0,
    );
  }

  static Color _parseColor(String? colorStr) {
    // Basic support for common Tailwind colors or default
    if (colorStr == null) return Colors.blue;
    if (colorStr.contains('blue')) return Colors.blue;
    if (colorStr.contains('green')) return Colors.green;
    if (colorStr.contains('red')) return Colors.red;
    if (colorStr.contains('orange')) return Colors.orange;
    if (colorStr.contains('purple')) return Colors.purple;
    if (colorStr.contains('pink')) return Colors.pink;
    return Colors.blue;
  }
}

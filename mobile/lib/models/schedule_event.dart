import 'package:flutter/material.dart';

class ScheduleEvent {
  final String day;
  final String time;
  final String subject;
  final String teacher;
  final String room;
  final Color color;
  final int duration;

  ScheduleEvent({
    required this.day,
    required this.time,
    required this.subject,
    required this.teacher,
    required this.room,
    required this.color,
    this.duration = 1,
  });
  factory ScheduleEvent.fromJson(Map<String, dynamic> json) {
    return ScheduleEvent(
      day: json['day'] ?? 'Mon',
      time: json['startTime'] ?? '09:00 AM', // API returns startTime
      subject: json['title'] ?? '', // API returns title
      teacher: json['teacher']?['name'] ?? 'Staff',
      room: json['room'] ?? '',
      color: _parseColor(json['color']),
      duration: 1,
    );
  }

  static Color _parseColor(String? colorStr) {
    if (colorStr == null) return Colors.blue;
    if (colorStr.contains('blue')) return Colors.blue;
    if (colorStr.contains('green')) return Colors.green;
    if (colorStr.contains('red')) return Colors.red;
    if (colorStr.contains('purple')) return Colors.purple;
    if (colorStr.contains('orange')) return Colors.orange;
    return Colors.blue;
  }
}

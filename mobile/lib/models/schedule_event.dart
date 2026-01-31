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
}

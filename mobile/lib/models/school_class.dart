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
}

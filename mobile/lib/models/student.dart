class Student {
  final String id;
  final String name;
  final String grade;
  final String classMatch; // "10th - A"
  final String email;
  final String status; // 'Active', 'Absent', 'Suspended'
  final String? avatarUrl;

  Student({
    required this.id,
    required this.name,
    required this.grade,
    required this.classMatch,
    required this.email,
    required this.status,
    this.avatarUrl,
  });
}

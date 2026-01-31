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
  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      grade: json['grade'] ?? '',
      classMatch: json['classMatch'] ?? '',
      status: json['status'] ?? 'Active',
      avatarUrl: json['avatar'],
    );
  }
}

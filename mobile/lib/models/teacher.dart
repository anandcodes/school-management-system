class Teacher {
  final String id;
  final String name;
  final String subject;
  final String email;
  final int classesCount;
  final int studentsCount;
  final String? avatarUrl;

  Teacher({
    required this.id,
    required this.name,
    required this.subject,
    required this.email,
    required this.classesCount,
    required this.studentsCount,
    this.avatarUrl,
  });
  factory Teacher.fromJson(Map<String, dynamic> json) {
    return Teacher(
      id: json['id'].toString(),
      name: json['name'] ?? '',
      subject: json['subject'] ?? '',
      email: json['email'] ?? '',
      classesCount: (json['classes'] as List?)?.length ?? 0,
      studentsCount: 0,
      avatarUrl: json['avatar'],
    );
  }
}

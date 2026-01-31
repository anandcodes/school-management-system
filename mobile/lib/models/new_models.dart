class Exam {
  final String id;
  final String title;
  final String subject;
  final String date;
  final int totalMarks;

  Exam(
      {required this.id,
      required this.title,
      required this.subject,
      required this.date,
      required this.totalMarks});

  factory Exam.fromJson(Map<String, dynamic> json) {
    return Exam(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      subject: json['subject'] ?? '',
      date: json['date'] != null ? json['date'].toString().split('T')[0] : '',
      totalMarks: json['totalMarks'] ?? 0,
    );
  }
}

class Message {
  final String id;
  final String senderId;
  final String receiverId;
  final String content;
  final bool read;
  final DateTime createdAt;

  Message({
    required this.id,
    required this.senderId,
    required this.receiverId,
    required this.content,
    required this.read,
    required this.createdAt,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'] ?? '',
      senderId: json['senderId'] ?? '',
      receiverId: json['receiverId'] ?? '',
      content: json['content'] ?? '',
      read: json['read'] ?? false,
      createdAt: json['createdAt'] != null
          ? DateTime.parse(json['createdAt'])
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'senderId': senderId,
      'receiverId': receiverId,
      'content': content,
    };
  }
}

class FeeRecord {
  final String id;
  final String studentName;
  final String type;
  final double amount;
  final String status; // Paid, Pending, Overdue
  final String dueDate;

  FeeRecord(
      {required this.id,
      required this.studentName,
      required this.type,
      required this.amount,
      required this.status,
      required this.dueDate});

  factory FeeRecord.fromJson(Map<String, dynamic> json) {
    return FeeRecord(
      id: json['id'] ?? '',
      studentName: json['studentName'] ?? 'Student',
      type: json['type'] ?? 'Tuition',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] == 'PAID'
          ? 'Paid'
          : (json['status'] == 'OVERDUE' ? 'Overdue' : 'Pending'),
      dueDate: json['dueDate'] != null
          ? json['dueDate'].toString().split('T')[0]
          : '',
    );
  }
}

class NotificationItem {
  final String id;
  final String title;
  final String message;
  final String time;
  final String type; // info, warning, success
  bool read;

  NotificationItem(
      {required this.id,
      required this.title,
      required this.message,
      required this.time,
      required this.type,
      this.read = false});

  factory NotificationItem.fromJson(Map<String, dynamic> json) {
    return NotificationItem(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      message: json['message'] ?? '',
      time: json['time'] ?? 'Just now', // Requires calculation in real app
      type: json['type'] ?? 'info',
      read: json['read'] ?? false,
    );
  }
}

class ExamResult {
  final String id;
  final String examId;
  final String studentId;
  final String studentName;
  double marksObtained;
  String grade;

  ExamResult({
    required this.id,
    required this.examId,
    required this.studentId,
    required this.studentName,
    required this.marksObtained,
    required this.grade,
  });

  factory ExamResult.fromJson(Map<String, dynamic> json) {
    return ExamResult(
      id: json['id'] ?? '',
      examId: json['examId'] ?? '',
      studentId: json['studentId'] ?? '',
      studentName: json['studentName'] ?? '',
      marksObtained: (json['marksObtained'] as num?)?.toDouble() ?? 0.0,
      grade: json['grade'] ?? 'F',
    );
  }
}

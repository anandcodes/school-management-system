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
}

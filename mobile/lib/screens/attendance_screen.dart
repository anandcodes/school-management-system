import 'package:flutter/material.dart';
import '../../models/school_class.dart';
import '../../models/student.dart';
import '../../services/data_service.dart';

class AttendanceScreen extends StatefulWidget {
  final SchoolClass schoolClass;

  const AttendanceScreen({super.key, required this.schoolClass});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  final DataService _dataService = DataService();
  List<Student> _students = [];
  final Map<String, String> _attendance = {};
  bool _isLoading = true;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _loadStudents();
  }

  Future<void> _loadStudents() async {
    final students =
        await _dataService.getStudentsByClass(widget.schoolClass.id);
    if (mounted) {
      setState(() {
        _students = students;
        // Default to 'Present'
        for (var s in students) {
          _attendance[s.id] = 'Present';
        }
        _isLoading = false;
      });
    }
  }

  Future<void> _saveAttendance() async {
    setState(() => _isSaving = true);
    await _dataService.saveAttendance(
        widget.schoolClass.id, DateTime.now(), _attendance);
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Attendance saved successfully')),
      );
      Navigator.of(context).pop();
    }
  }

  void _toggleStatus(String studentId, String currentStatus) {
    setState(() {
      if (currentStatus == 'Present') {
        _attendance[studentId] = 'Absent';
      } else if (currentStatus == 'Absent') {
        _attendance[studentId] = 'Late';
      } else {
        _attendance[studentId] = 'Present';
      }
    });
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Present':
        return Colors.green;
      case 'Absent':
        return Colors.red;
      case 'Late':
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('${widget.schoolClass.name} Attendance')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text("Date: ${DateTime.now().toString().split(' ')[0]}",
                          style: TextStyle(color: Colors.grey.shade600)),
                      Text("${_students.length} Students",
                          style: const TextStyle(fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
                Expanded(
                  child: ListView.separated(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: _students.length,
                    separatorBuilder: (context, index) => const Divider(),
                    itemBuilder: (context, index) {
                      final student = _students[index];
                      final status = _attendance[student.id] ?? 'Present';

                      return ListTile(
                        leading: CircleAvatar(
                          child: Text(student.name[0]),
                        ),
                        title: Text(student.name,
                            style:
                                const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text(student.id),
                        trailing: InkWell(
                          onTap: () => _toggleStatus(student.id, status),
                          borderRadius: BorderRadius.circular(20),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: _getStatusColor(status).withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                              border:
                                  Border.all(color: _getStatusColor(status)),
                            ),
                            child: Text(
                              status,
                              style: TextStyle(
                                color: _getStatusColor(status),
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: _isSaving ? null : _saveAttendance,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Theme.of(context).primaryColor,
                        foregroundColor: Colors.white,
                      ),
                      child: _isSaving
                          ? const CircularProgressIndicator(color: Colors.white)
                          : const Text('Submit Attendance',
                              style: TextStyle(
                                  fontSize: 16, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ),
              ],
            ),
    );
  }
}

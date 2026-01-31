import 'package:flutter/material.dart';
import '../models/student.dart';
import '../services/data_service.dart';
import 'add_student_screen.dart';

class StudentsScreen extends StatefulWidget {
  const StudentsScreen({super.key});

  @override
  State<StudentsScreen> createState() => _StudentsScreenState();
}

class _StudentsScreenState extends State<StudentsScreen> {
  List<Student> _students = [];
  bool _isLoading = true;
  final DataService _dataService = DataService();

  @override
  void initState() {
    super.initState();
    _loadStudents();
  }

  Future<void> _loadStudents() async {
    final students = await _dataService.getStudents();
    if (mounted) {
      setState(() {
        _students = students;
        _isLoading = false;
      });
    }
  }

  void _navigateToAddStudent() async {
    final result = await Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => const AddStudentScreen()),
    );

    if (result == true) {
      setState(() {
        _isLoading = true;
      });
      _loadStudents();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Students'),
        actions: [
          IconButton(icon: const Icon(Icons.search), onPressed: () {}),
          IconButton(icon: const Icon(Icons.filter_list), onPressed: () {}),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _navigateToAddStudent,
        child: const Icon(Icons.add),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: _students.length,
              separatorBuilder: (context, index) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final student = _students[index];
                Color statusColor;
                switch (student.status) {
                  case 'Active':
                    statusColor = Colors.green;
                    break;
                  case 'Absent':
                    statusColor = Colors.orange;
                    break;
                  case 'Suspended':
                    statusColor = Colors.red;
                    break;
                  default:
                    statusColor = Colors.grey;
                }

                return Card(
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor:
                          Theme.of(context).primaryColor.withOpacity(0.1),
                      child: Text(
                        student.name[0],
                        style: TextStyle(color: Theme.of(context).primaryColor),
                      ),
                    ),
                    title: Text(student.name,
                        style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text(student.id),
                    trailing: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text("${student.grade} - ${student.classMatch}",
                            style:
                                const TextStyle(fontWeight: FontWeight.w500)),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: statusColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(
                            student.status,
                            style: TextStyle(
                                color: statusColor,
                                fontSize: 10,
                                fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}

import 'package:flutter/material.dart';
import '../models/teacher.dart';
import '../services/data_service.dart';
import 'add_teacher_screen.dart';

class TeachersScreen extends StatefulWidget {
  const TeachersScreen({super.key});

  @override
  State<TeachersScreen> createState() => _TeachersScreenState();
}

class _TeachersScreenState extends State<TeachersScreen> {
  List<Teacher> _teachers = [];
  bool _isLoading = true;
  final DataService _dataService = DataService();

  @override
  void initState() {
    super.initState();
    _loadTeachers();
  }

  Future<void> _loadTeachers() async {
    final teachers = await _dataService.getTeachers();
    if (mounted) {
      setState(() {
        _teachers = teachers;
        _isLoading = false;
      });
    }
  }

  void _navigateToAddTeacher() async {
    final result = await Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => const AddTeacherScreen()),
    );
    if (result == true) {
      setState(() {
        _isLoading = true;
      });
      _loadTeachers();
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Teachers'),
        actions: [
          IconButton(
              icon: const Icon(Icons.add), onPressed: _navigateToAddTeacher),
        ],
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _teachers.length,
        separatorBuilder: (context, index) => const SizedBox(height: 16),
        itemBuilder: (context, index) {
          final teacher = _teachers[index];
          return Card(
            elevation: 2,
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 24,
                        backgroundColor: Colors.indigo.shade50,
                        child: Text(
                          teacher.name.split(" ").map((e) => e[0]).join(""),
                          style: TextStyle(
                              color: Theme.of(context).primaryColor,
                              fontWeight: FontWeight.bold),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              teacher.name,
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                            Text(
                              teacher.subject,
                              style: TextStyle(
                                  color: Theme.of(context).primaryColor,
                                  fontSize: 13,
                                  fontWeight: FontWeight.w500),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.more_vert),
                        onPressed: () {},
                      ),
                    ],
                  ),
                  const Divider(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _buildInfoItem(Icons.class_outlined,
                          '${teacher.classesCount} Classes'),
                      _buildInfoItem(Icons.people_outline,
                          '${teacher.studentsCount} Students'),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildInfoItem(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey),
        const SizedBox(width: 4),
        Text(text, style: const TextStyle(color: Colors.grey, fontSize: 13)),
      ],
    );
  }
}

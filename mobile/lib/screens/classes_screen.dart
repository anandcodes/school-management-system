import 'package:flutter/material.dart';
import '../models/school_class.dart';
import '../services/data_service.dart';
import 'add_class_screen.dart';
import 'attendance_screen.dart';

class ClassesScreen extends StatefulWidget {
  const ClassesScreen({super.key});

  @override
  State<ClassesScreen> createState() => _ClassesScreenState();
}

class _ClassesScreenState extends State<ClassesScreen> {
  List<SchoolClass> _classes = [];
  bool _isLoading = true;
  final DataService _dataService = DataService();

  @override
  void initState() {
    super.initState();
    _loadClasses();
  }

  Future<void> _loadClasses() async {
    final classes = await _dataService.getClasses();
    if (mounted) {
      setState(() {
        _classes = classes;
        _isLoading = false;
      });
    }
  }

  void _navigateToAddClass() async {
    final result = await Navigator.of(context).push(
      MaterialPageRoute(builder: (context) => const AddClassScreen()),
    );
    if (result == true) {
      setState(() {
        _isLoading = true;
      });
      _loadClasses();
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Classes'),
        actions: [
          IconButton(
              icon: const Icon(Icons.add), onPressed: _navigateToAddClass),
        ],
      ),
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _classes.length,
        separatorBuilder: (context, index) => const SizedBox(height: 16),
        itemBuilder: (context, index) {
          final cls = _classes[index];
          final color = cls.color;

          return GestureDetector(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                    builder: (context) => AttendanceScreen(schoolClass: cls)),
              );
            },
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.grey.withOpacity(0.2)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Stack(
                  children: [
                    Positioned(
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 6,
                      child: Container(color: color),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(
                          left: 22.0, right: 16.0, top: 16.0, bottom: 16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.grey.shade100,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  cls.grade,
                                  style: TextStyle(
                                      color: Colors.grey.shade700,
                                      fontSize: 12,
                                      fontWeight: FontWeight.bold),
                                ),
                              ),
                              Icon(Icons.more_horiz,
                                  color: Colors.grey.shade400),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(
                            cls.name,
                            style: const TextStyle(
                                fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'by ${cls.teacherName}',
                            style: TextStyle(
                                color: Colors.grey.shade600, fontSize: 13),
                          ),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Icon(Icons.people_outline,
                                  size: 16, color: Colors.grey.shade500),
                              const SizedBox(width: 4),
                              Text('${cls.studentsCount} Students',
                                  style: TextStyle(
                                      color: Colors.grey.shade600,
                                      fontSize: 12)),
                              const SizedBox(width: 16),
                              Icon(Icons.access_time,
                                  size: 16, color: Colors.grey.shade500),
                              const SizedBox(width: 4),
                              Text(cls.time,
                                  style: TextStyle(
                                      color: Colors.grey.shade600,
                                      fontSize: 12)),
                            ],
                          )
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}

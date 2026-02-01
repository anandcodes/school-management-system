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
  List<SchoolClass> _filteredClasses = [];
  bool _isLoading = true;
  final DataService _dataService = DataService();
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadClasses();
    _searchController.addListener(_filterClasses);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadClasses() async {
    final classes = await _dataService.getClasses();
    if (mounted) {
      setState(() {
        _classes = classes;
        _filteredClasses = classes;
        _isLoading = false;
      });
    }
  }

  void _filterClasses() {
    setState(() {
      _filteredClasses = _classes.where((cls) {
        final searchLower = _searchController.text.toLowerCase();
        return cls.name.toLowerCase().contains(searchLower) ||
            cls.teacherName.toLowerCase().contains(searchLower) ||
            cls.grade.toLowerCase().contains(searchLower) ||
            cls.id.toLowerCase().contains(searchLower);
      }).toList();
    });
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

  Future<void> _editClass(SchoolClass cls) async {
    final result = await Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => AddClassScreen(schoolClass: cls),
      ),
    );

    if (result == true) {
      setState(() {
        _isLoading = true;
      });
      _loadClasses();
    }
  }

  Future<void> _deleteClass(SchoolClass cls) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Class'),
        content: Text(
          'Are you sure you want to delete ${cls.name}? All related attendance and exam records will be removed.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      try {
        await _dataService.deleteClass(cls.id);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('${cls.name} deleted successfully')),
          );
        }
        _loadClasses();
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error deleting class: $e')),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Classes'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(70),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search by name, teacher, grade, or ID...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                        },
                      )
                    : null,
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _navigateToAddClass,
        child: const Icon(Icons.add),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _filteredClasses.isEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.search_off, size: 64, color: Colors.grey[400]),
                      const SizedBox(height: 16),
                      Text(
                        _searchController.text.isNotEmpty
                            ? 'No classes found'
                            : 'No classes yet',
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                )
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: _filteredClasses.length,
                  separatorBuilder: (context, index) =>
                      const SizedBox(height: 16),
                  itemBuilder: (context, index) {
                    final cls = _filteredClasses[index];
                    final color = cls.color;

                    return GestureDetector(
                      onTap: () {
                        Navigator.of(context).push(
                          MaterialPageRoute(
                              builder: (context) =>
                                  AttendanceScreen(schoolClass: cls)),
                        );
                      },
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border:
                              Border.all(color: Colors.grey.withOpacity(0.2)),
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
                                    left: 22.0,
                                    right: 16.0,
                                    top: 16.0,
                                    bottom: 16.0),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Container(
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: Colors.grey.shade100,
                                            borderRadius:
                                                BorderRadius.circular(6),
                                          ),
                                          child: Text(
                                            cls.grade,
                                            style: TextStyle(
                                                color: Colors.grey.shade700,
                                                fontSize: 12,
                                                fontWeight: FontWeight.bold),
                                          ),
                                        ),
                                        PopupMenuButton(
                                          icon: Icon(Icons.more_vert,
                                              color: Colors.grey.shade600),
                                          itemBuilder: (context) => [
                                            const PopupMenuItem(
                                              value: 'edit',
                                              child: Row(
                                                children: [
                                                  Icon(Icons.edit, size: 20),
                                                  SizedBox(width: 12),
                                                  Text('Edit'),
                                                ],
                                              ),
                                            ),
                                            const PopupMenuItem(
                                              value: 'delete',
                                              child: Row(
                                                children: [
                                                  Icon(Icons.delete,
                                                      size: 20,
                                                      color: Colors.red),
                                                  SizedBox(width: 12),
                                                  Text('Delete',
                                                      style: TextStyle(
                                                          color: Colors.red)),
                                                ],
                                              ),
                                            ),
                                          ],
                                          onSelected: (value) {
                                            if (value == 'edit') {
                                              _editClass(cls);
                                            } else if (value == 'delete') {
                                              _deleteClass(cls);
                                            }
                                          },
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      cls.name,
                                      style: const TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.bold),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      'by ${cls.teacherName}',
                                      style: TextStyle(
                                          color: Colors.grey.shade600,
                                          fontSize: 13),
                                    ),
                                    const SizedBox(height: 16),
                                    Row(
                                      children: [
                                        Icon(Icons.people_outline,
                                            size: 16,
                                            color: Colors.grey.shade500),
                                        const SizedBox(width: 4),
                                        Text('${cls.studentsCount} Students',
                                            style: TextStyle(
                                                color: Colors.grey.shade600,
                                                fontSize: 12)),
                                        const SizedBox(width: 16),
                                        Icon(Icons.access_time,
                                            size: 16,
                                            color: Colors.grey.shade500),
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

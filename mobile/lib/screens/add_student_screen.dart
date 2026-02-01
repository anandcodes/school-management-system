import 'package:flutter/material.dart';
import '../../models/student.dart';
import '../../services/data_service.dart';

class AddStudentScreen extends StatefulWidget {
  final Student? student; // Optional student for editing

  const AddStudentScreen({super.key, this.student});

  @override
  State<AddStudentScreen> createState() => _AddStudentScreenState();
}

class _AddStudentScreenState extends State<AddStudentScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  String _grade = '10th';
  String _classMatch = 'A';
  String _status = 'Active';
  bool _isLoading = false;

  final DataService _dataService = DataService();

  @override
  void initState() {
    super.initState();
    // Pre-fill form if editing
    if (widget.student != null) {
      _nameController.text = widget.student!.name;
      _emailController.text = widget.student!.email;
      _grade = widget.student!.grade;
      _classMatch = widget.student!.classMatch;
      _status = widget.student!.status;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      try {
        if (widget.student != null) {
          // Update existing student
          final updatedData = {
            'name': _nameController.text,
            'email': _emailController.text,
            'grade': _grade,
            'classMatch': _classMatch,
            'status': _status,
          };
          await _dataService.updateStudent(widget.student!.id, updatedData);

          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Student updated successfully')),
            );
            Navigator.of(context).pop(true);
          }
        } else {
          // Create new student
          final student = Student(
            id: "ST-${DateTime.now().millisecondsSinceEpoch.toString().substring(8)}",
            name: _nameController.text,
            email: _emailController.text,
            grade: _grade,
            classMatch: _classMatch,
            status: _status,
          );

          await _dataService.addStudent(student);

          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Student added successfully')),
            );
            Navigator.of(context).pop(true);
          }
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error: $e')),
          );
        }
      } finally {
        if (mounted) {
          setState(() {
            _isLoading = false;
          });
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.student != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Edit Student' : 'Add Student'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Full Name',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.person),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter a name';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email Address',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.email),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter an email';
                  }
                  if (!value.contains('@')) {
                    return 'Please enter a valid email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _grade,
                      decoration: const InputDecoration(
                          labelText: 'Grade', border: OutlineInputBorder()),
                      items: ['9th', '10th', '11th', '12th']
                          .map(
                              (e) => DropdownMenuItem(value: e, child: Text(e)))
                          .toList(),
                      onChanged: (v) => setState(() => _grade = v!),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: DropdownButtonFormField<String>(
                      value: _classMatch,
                      decoration: const InputDecoration(
                          labelText: 'Class', border: OutlineInputBorder()),
                      items: ['A', 'B', 'C']
                          .map(
                              (e) => DropdownMenuItem(value: e, child: Text(e)))
                          .toList(),
                      onChanged: (v) => setState(() => _classMatch = v!),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              const Text('Status',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500)),
              Row(
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Expanded(
                    child: RadioListTile<String>(
                      title: const Text('Active'),
                      value: 'Active',
                      groupValue: _status,
                      contentPadding: EdgeInsets.zero,
                      onChanged: (v) => setState(() => _status = v!),
                    ),
                  ),
                  Expanded(
                    child: RadioListTile<String>(
                      title: const Text('Absent'),
                      value: 'Absent',
                      groupValue: _status,
                      contentPadding: EdgeInsets.zero,
                      onChanged: (v) => setState(() => _status = v!),
                    ),
                  ),
                ],
              ),
              RadioListTile<String>(
                title: const Text('Suspended'),
                value: 'Suspended',
                groupValue: _status,
                contentPadding: EdgeInsets.zero,
                onChanged: (v) => setState(() => _status = v!),
              ),
              const SizedBox(height: 32),
              SizedBox(
                height: 50,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Theme.of(context).primaryColor,
                    foregroundColor: Colors.white,
                  ),
                  child: _isLoading
                      ? const Center(
                          child: CircularProgressIndicator(color: Colors.white))
                      : Text(
                          isEditing ? 'Update Student' : 'Save Student',
                          style: const TextStyle(
                              fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

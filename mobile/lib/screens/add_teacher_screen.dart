import 'package:flutter/material.dart';
import '../../models/teacher.dart';
import '../../services/data_service.dart';

class AddTeacherScreen extends StatefulWidget {
  final Teacher? teacher; // Optional teacher for editing

  const AddTeacherScreen({super.key, this.teacher});

  @override
  State<AddTeacherScreen> createState() => _AddTeacherScreenState();
}

class _AddTeacherScreenState extends State<AddTeacherScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _subjectController = TextEditingController();

  bool _isLoading = false;
  final DataService _dataService = DataService();

  @override
  void initState() {
    super.initState();
    // Pre-fill form if editing
    if (widget.teacher != null) {
      _nameController.text = widget.teacher!.name;
      _emailController.text = widget.teacher!.email;
      _subjectController.text = widget.teacher!.subject;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _subjectController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      try {
        if (widget.teacher != null) {
          // Update existing teacher
          final updatedData = {
            'name': _nameController.text,
            'email': _emailController.text,
            'subject': _subjectController.text,
          };
          await _dataService.updateTeacher(widget.teacher!.id, updatedData);

          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Teacher updated successfully')),
            );
            Navigator.of(context).pop(true);
          }
        } else {
          // Create new teacher
          final teacher = Teacher(
            id: DateTime.now().millisecondsSinceEpoch.toString(),
            name: _nameController.text,
            email: _emailController.text,
            subject: _subjectController.text,
            classesCount: 0,
            studentsCount: 0,
          );

          await _dataService.addTeacher(teacher);

          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Teacher added successfully')),
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
    final isEditing = widget.teacher != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Edit Teacher' : 'Add Teacher'),
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
                validator: (value) =>
                    value!.isEmpty ? 'Please enter a name' : null,
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
                validator: (value) =>
                    !value!.contains('@') ? 'Please enter a valid email' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _subjectController,
                decoration: const InputDecoration(
                  labelText: 'Subject',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.book),
                ),
                validator: (value) =>
                    value!.isEmpty ? 'Please enter a subject' : null,
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
                          isEditing ? 'Update Teacher' : 'Save Teacher',
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

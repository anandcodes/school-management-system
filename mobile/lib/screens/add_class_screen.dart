import 'package:flutter/material.dart';
import '../../models/school_class.dart';
import '../../services/data_service.dart';

class AddClassScreen extends StatefulWidget {
  final SchoolClass? schoolClass; // Optional class for editing

  const AddClassScreen({super.key, this.schoolClass});

  @override
  State<AddClassScreen> createState() => _AddClassScreenState();
}

class _AddClassScreenState extends State<AddClassScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _teacherController = TextEditingController();
  final _timeController = TextEditingController();
  String _grade = 'Grade 9';
  Color _color = Colors.blue;

  bool _isLoading = false;
  final DataService _dataService = DataService();

  @override
  void initState() {
    super.initState();
    // Pre-fill form if editing
    if (widget.schoolClass != null) {
      _nameController.text = widget.schoolClass!.name;
      _teacherController.text = widget.schoolClass!.teacherName;
      _timeController.text = widget.schoolClass!.time;
      _grade = widget.schoolClass!.grade;
      _color = widget.schoolClass!.color;
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _teacherController.dispose();
    _timeController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
      });

      try {
        if (widget.schoolClass != null) {
          // Update existing class
          final updatedData = {
            'name': _nameController.text,
            'grade': _grade,
            'teacherName': _teacherController.text,
            'time': _timeController.text,
            'color': _color.value, // Send color as int
          };
          await _dataService.updateClass(widget.schoolClass!.id, updatedData);

          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Class updated successfully')),
            );
            Navigator.of(context).pop(true);
          }
        } else {
          // Create new class
          final cls = SchoolClass(
            id: DateTime.now().millisecondsSinceEpoch.toString(),
            name: _nameController.text,
            grade: _grade,
            teacherName: _teacherController.text,
            studentsCount: 0,
            time: _timeController.text,
            progress: 0,
            color: _color,
          );

          await _dataService.addClass(cls);

          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Class added successfully')),
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
    final isEditing = widget.schoolClass != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Edit Class' : 'Add Class'),
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
                  labelText: 'Class Name',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.class_),
                ),
                validator: (value) =>
                    value!.isEmpty ? 'Please enter a class name' : null,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _grade,
                decoration: const InputDecoration(
                    labelText: 'Grade',
                    border: OutlineInputBorder(),
                    prefixIcon: Icon(Icons.grade)),
                items: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']
                    .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                    .toList(),
                onChanged: (v) => setState(() => _grade = v!),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _teacherController,
                decoration: const InputDecoration(
                  labelText: 'Teacher Name',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.person),
                ),
                validator: (value) =>
                    value!.isEmpty ? 'Please enter a teacher name' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _timeController,
                decoration: const InputDecoration(
                  labelText: 'Time (e.g. 09:00 AM)',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.access_time),
                ),
                validator: (value) =>
                    value!.isEmpty ? 'Please enter a time' : null,
              ),
              const SizedBox(height: 24),
              const Text("Class Color",
                  style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              Wrap(
                spacing: 12,
                children: [
                  Colors.blue,
                  Colors.purple,
                  Colors.orange,
                  Colors.pink,
                  Colors.green,
                  Colors.teal
                ]
                    .map((c) => GestureDetector(
                          onTap: () => setState(() => _color = c),
                          child: Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: c,
                              shape: BoxShape.circle,
                              border: _color == c
                                  ? Border.all(color: Colors.black, width: 2)
                                  : null,
                            ),
                          ),
                        ))
                    .toList(),
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
                          isEditing ? 'Update Class' : 'Save Class',
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

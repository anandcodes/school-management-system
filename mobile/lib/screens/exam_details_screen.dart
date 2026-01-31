import 'package:flutter/material.dart';
import '../models/new_models.dart';
import '../services/data_service.dart';

class ExamDetailsScreen extends StatefulWidget {
  final Exam exam;

  const ExamDetailsScreen({super.key, required this.exam});

  @override
  State<ExamDetailsScreen> createState() => _ExamDetailsScreenState();
}

class _ExamDetailsScreenState extends State<ExamDetailsScreen> {
  List<ExamResult> _results = [];
  bool _isLoading = true;
  final DataService _dataService = DataService();

  @override
  void initState() {
    super.initState();
    _loadResults();
  }

  Future<void> _loadResults() async {
    final data = await _dataService.getExamResults(widget.exam.id);
    if (mounted) {
      setState(() {
        _results = data;
        _isLoading = false;
      });
    }
  }

  String _calculateGrade(double marks, int total) {
    double percentage = (marks / total) * 100;
    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  }

  void _showEditSheet(ExamResult result) {
    final TextEditingController controller =
        TextEditingController(text: result.marksObtained.toString());

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => Padding(
        padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
            left: 16,
            right: 16,
            top: 16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("Edit Marks for ${result.studentName}",
                style:
                    const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            TextField(
              controller: controller,
              keyboardType: TextInputType.number,
              autofocus: true,
              decoration: InputDecoration(
                labelText: "Marks Obtained (Max: ${widget.exam.totalMarks})",
                border: const OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  final newMarks = double.tryParse(controller.text);
                  if (newMarks != null &&
                      newMarks >= 0 &&
                      newMarks <= widget.exam.totalMarks) {
                    setState(() {
                      result.marksObtained = newMarks;
                      result.grade =
                          _calculateGrade(newMarks, widget.exam.totalMarks);
                    });
                    // Mock save
                    _dataService.saveExamResults(widget.exam.id, _results);
                    Navigator.pop(context);
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                        content: Text(
                            "Invalid marks. Must be between 0 and ${widget.exam.totalMarks}")));
                  }
                },
                child: const Text("Save"),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.exam.title),
        actions: [
          Center(
            child: Padding(
              padding: const EdgeInsets.only(right: 16.0),
              child: Text(
                "Max: ${widget.exam.totalMarks}",
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          )
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: _results.length,
              itemBuilder: (context, index) {
                final result = _results[index];
                return ListTile(
                  title: Text(result.studentName,
                      style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text("ID: ${result.studentId}"),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                              "${result.marksObtained} / ${widget.exam.totalMarks}",
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold, fontSize: 16)),
                          Text(result.grade,
                              style: TextStyle(
                                color: result.grade.startsWith('A')
                                    ? Colors.green
                                    : Colors.orange,
                                fontWeight: FontWeight.bold,
                              )),
                        ],
                      ),
                      const SizedBox(width: 8),
                      IconButton(
                        icon: const Icon(Icons.edit, color: Colors.blue),
                        onPressed: () => _showEditSheet(result),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}

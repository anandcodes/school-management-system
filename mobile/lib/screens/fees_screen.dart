import 'package:flutter/material.dart';
import '../models/new_models.dart';
import '../services/data_service.dart';

class FeesScreen extends StatefulWidget {
  const FeesScreen({super.key});

  @override
  State<FeesScreen> createState() => _FeesScreenState();
}

class _FeesScreenState extends State<FeesScreen> {
  List<FeeRecord> _fees = [];
  bool _isLoading = true;
  final DataService _dataService = DataService();

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final data = await _dataService.getFees();
    if (mounted) {
      setState(() {
        _fees = data;
        _isLoading = false;
      });
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'Paid':
        return Colors.green;
      case 'Pending':
        return Colors.orange;
      case 'Overdue':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  Future<void> _payFee(FeeRecord fee) async {
    bool? confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Confirm Payment"),
        content: Text("Pay \$${fee.amount} for ${fee.type}?"),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: const Text("Cancel")),
          TextButton(
              onPressed: () => Navigator.pop(context, true),
              child: const Text("Pay")),
        ],
      ),
    );

    if (confirm == true) {
      await _dataService.payFee(fee.id);
      setState(() {
        final index = _fees.indexOf(fee);
        if (index != -1) {
          _fees[index] = FeeRecord(
              id: fee.id,
              studentName: fee.studentName,
              type: fee.type,
              amount: fee.amount,
              status: "Paid",
              dueDate: fee.dueDate);
        }
      });
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text("Payment Successful")));
      }
    }
  }

  String _selectedFilter = 'All';

  List<FeeRecord> get _filteredFees {
    if (_selectedFilter == 'All') return _fees;
    return _fees.where((f) => f.status == _selectedFilter).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Fees & Payments')),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : Column(
              children: [
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  child: Row(
                    children: ['All', 'Paid', 'Pending', 'Overdue']
                        .map((filter) => Padding(
                              padding: const EdgeInsets.only(right: 8.0),
                              child: ChoiceChip(
                                label: Text(filter),
                                selected: _selectedFilter == filter,
                                onSelected: (selected) {
                                  if (selected) {
                                    setState(() => _selectedFilter = filter);
                                  }
                                },
                              ),
                            ))
                        .toList(),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Row(
                    children: [
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.grey.shade200)),
                          child: const Column(children: [
                            Text("Pending",
                                style: TextStyle(color: Colors.grey)),
                            Text("\$300",
                                style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.orange))
                          ]),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.grey.shade200)),
                          child: const Column(children: [
                            Text("Paid", style: TextStyle(color: Colors.grey)),
                            Text("\$1200",
                                style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.green))
                          ]),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Expanded(
                  child: _filteredFees.isEmpty
                      ? const Center(child: Text("No records found"))
                      : ListView.separated(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          itemCount: _filteredFees.length,
                          separatorBuilder: (c, i) => const Divider(),
                          itemBuilder: (context, index) {
                            final fee = _filteredFees[index];
                            return ListTile(
                              onTap: fee.status != "Paid"
                                  ? () => _payFee(fee)
                                  : null,
                              leading: Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: Colors.grey.shade100,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: const Icon(Icons.attach_money),
                              ),
                              title: Text(fee.type,
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold)),
                              subtitle: Text("Due: ${fee.dueDate}"),
                              trailing: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text("\$${fee.amount.toInt()}",
                                      style: const TextStyle(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16)),
                                  Text(fee.status,
                                      style: TextStyle(
                                          fontSize: 12,
                                          color: _getStatusColor(fee.status),
                                          fontWeight: FontWeight.bold)),
                                ],
                              ),
                            );
                          },
                        ),
                ),
              ],
            ),
    );
  }
}

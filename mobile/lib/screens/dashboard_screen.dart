import 'package:flutter/material.dart';
import '../services/data_service.dart';
import 'schedule_screen.dart';
import 'exams_screen.dart';
import 'fees_screen.dart';
import 'notifications_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  Map<String, dynamic>? _stats;
  List<Map<String, String>> _activities = [];
  bool _isLoading = true;
  final DataService _dataService = DataService();

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final results = await Future.wait([
        _dataService.getDashboardStats(),
        _dataService.getActivities(),
      ]);

      if (mounted) {
        setState(() {
          _stats = results[0] as Map<String, dynamic>;
          _activities = results[1] as List<Map<String, String>>;
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint("Error loading dashboard data: $e");
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return ListView(
      padding: const EdgeInsets.all(16.0),
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Dashboard',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            IconButton(
                icon: const Icon(Icons.refresh),
                onPressed: () {
                  setState(() => _isLoading = true);
                  _loadData();
                })
          ],
        ),
        const SizedBox(height: 16),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
          children: [
            StatCard(
              title: 'Total Students',
              value: _stats?['totalStudents'].toString() ?? '0',
              icon: Icons.people,
              color: Colors.blue,
            ),
            StatCard(
              title: 'Total Teachers',
              value: _stats?['totalTeachers'].toString() ?? '0',
              icon: Icons.school,
              color: Colors.purple,
            ),
            StatCard(
              title: 'Active Classes',
              value: _stats?['totalClasses'].toString() ?? '0',
              icon: Icons.class_,
              color: Colors.orange,
            ),
            StatCard(
              title: 'Attendance',
              value: '${_stats?['attendanceRate']}%',
              icon: Icons.check_circle,
              color: Colors.green,
            ),
          ],
        ),
        const SizedBox(height: 24),
        const Text(
          'Quick Access',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        GridView.count(
          crossAxisCount: 4,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          children: [
            _buildFeatureBtn(context, Icons.calendar_today, "Schedule",
                const ScheduleScreen()),
            _buildFeatureBtn(context, Icons.book, "Exams", const ExamsScreen()),
            _buildFeatureBtn(
                context, Icons.monetization_on, "Fees", const FeesScreen()),
            _buildFeatureBtn(context, Icons.notifications, "Alerts",
                const NotificationsScreen()),
          ],
        ),
        const SizedBox(height: 24),
        const Text(
          'Recent Activities',
          style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        ..._activities.map((activity) => ActivityItem(
              user: activity['user']!,
              action: activity['action']!,
              target: activity['target']!,
              time: activity['time']!,
            )),
      ],
    );
  }

  Widget _buildFeatureBtn(
      BuildContext context, IconData icon, String label, Widget screen) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        InkWell(
          onTap: () {
            Navigator.push(
                context, MaterialPageRoute(builder: (context) => screen));
          },
          borderRadius: BorderRadius.circular(16),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.blue.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, color: Colors.blue, size: 28),
          ),
        ),
        const SizedBox(height: 8),
        Text(label,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
      ],
    );
  }
}

class StatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;

  const StatCard({
    super.key,
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 32, color: color),
            const SizedBox(height: 12),
            Text(
              value,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              title,
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
            ),
          ],
        ),
      ),
    );
  }
}

class ActivityItem extends StatelessWidget {
  final String user;
  final String action;
  final String target;
  final String time;

  const ActivityItem({
    super.key,
    required this.user,
    required this.action,
    required this.target,
    required this.time,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        children: [
          CircleAvatar(
            backgroundColor: Theme.of(context).primaryColor.withOpacity(0.1),
            child: Text(
              user[0],
              style: TextStyle(
                  color: Theme.of(context).primaryColor,
                  fontWeight: FontWeight.bold),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                RichText(
                  text: TextSpan(
                    style: TextStyle(
                        color: Theme.of(context).textTheme.bodyMedium?.color),
                    children: [
                      TextSpan(
                          text: user,
                          style: const TextStyle(fontWeight: FontWeight.bold)),
                      TextSpan(text: ' $action '),
                      TextSpan(
                          text: target,
                          style: TextStyle(
                              color: Theme.of(context).primaryColor,
                              fontWeight: FontWeight.w500)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Text(
            time,
            style: TextStyle(color: Colors.grey.shade500, fontSize: 12),
          ),
        ],
      ),
    );
  }
}

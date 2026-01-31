import 'package:flutter/material.dart';
import 'package:school_management_mobile/screens/classes_screen.dart';
import 'package:school_management_mobile/screens/dashboard_screen.dart';
import 'package:school_management_mobile/screens/schedule_screen.dart';
import 'package:school_management_mobile/screens/settings_screen.dart';
import 'package:school_management_mobile/screens/students_screen.dart';
import 'package:school_management_mobile/screens/teachers_screen.dart';

import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../models/user_role.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  @override
  Widget build(BuildContext context) {
    final user = context.read<AuthProvider>().user;
    final role = user?.role ?? UserRole.student;

    List<Widget> screens = [const DashboardScreen()];
    List<BottomNavigationBarItem> navItems = [
      const BottomNavigationBarItem(
        icon: Icon(Icons.dashboard_outlined),
        activeIcon: Icon(Icons.dashboard),
        label: 'Dashboard',
      ),
    ];

    // Admin sees everything
    if (role == UserRole.admin) {
      screens.addAll([
        const StudentsScreen(),
        const TeachersScreen(),
        const ClassesScreen(),
        const ScheduleScreen(),
      ]);
      navItems.addAll([
        const BottomNavigationBarItem(
            icon: Icon(Icons.people_outline),
            activeIcon: Icon(Icons.people),
            label: 'Students'),
        const BottomNavigationBarItem(
            icon: Icon(Icons.school_outlined),
            activeIcon: Icon(Icons.school),
            label: 'Teachers'),
        const BottomNavigationBarItem(
            icon: Icon(Icons.book_outlined),
            activeIcon: Icon(Icons.book),
            label: 'Classes'),
        const BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today_outlined),
            activeIcon: Icon(Icons.calendar_today),
            label: 'Schedule'),
      ]);
    }
    // Teacher sees Classes, Schedule
    else if (role == UserRole.teacher) {
      screens.addAll([
        const ClassesScreen(),
        const ScheduleScreen(),
      ]);
      navItems.addAll([
        const BottomNavigationBarItem(
            icon: Icon(Icons.book_outlined),
            activeIcon: Icon(Icons.book),
            label: 'Classes'),
        const BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today_outlined),
            activeIcon: Icon(Icons.calendar_today),
            label: 'Schedule'),
      ]);
    }
    // Student/Parent sees Schedule
    else {
      screens.add(const ScheduleScreen());
      navItems.add(
        const BottomNavigationBarItem(
            icon: Icon(Icons.calendar_today_outlined),
            activeIcon: Icon(Icons.calendar_today),
            label: 'Schedule'),
      );
    }

    // Everyone sees Settings
    screens.add(const SettingsScreen());
    navItems.add(
      const BottomNavigationBarItem(
          icon: Icon(Icons.settings_outlined),
          activeIcon: Icon(Icons.settings),
          label: 'Settings'),
    );

    return Scaffold(
      body: SafeArea(
        child: screens[_selectedIndex],
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: navItems,
        currentIndex: _selectedIndex,
        selectedItemColor: Theme.of(context).primaryColor,
        unselectedItemColor: Colors.grey,
        showUnselectedLabels: true,
        type: BottomNavigationBarType.fixed,
        onTap: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
      ),
    );
  }
}

import 'package:flutter/material.dart';
import '../models/user.dart';
import '../models/user_role.dart';

class AuthProvider extends ChangeNotifier {
  bool _isLoading = false;
  User? _user;

  bool get isLoading => _isLoading;
  User? get user => _user;
  bool get isAuthenticated => _user != null;

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    // Simulate API call
    await Future.delayed(const Duration(seconds: 1));

    if (email == 'admin@school.edu' && password == 'password') {
      _user = User(
        id: '1',
        name: 'Administrator',
        email: email,
        role: UserRole.admin,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } else if (email == 'teacher@school.edu' && password == 'password') {
      _user = User(
        id: '2',
        name: 'John Teacher',
        email: email,
        role: UserRole.teacher,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } else if (email == 'student@school.edu' && password == 'password') {
      _user = User(
        id: '3',
        name: 'Alice Student',
        email: email,
        role: UserRole.student,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } else if (email == 'parent@school.edu' && password == 'password') {
      _user = User(
        id: '4',
        name: 'Bob Parent',
        email: email,
        role: UserRole.parent,
      );
      _isLoading = false;
      notifyListeners();
      return true;
    } else {
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  void logout() {
    _user = null;
    notifyListeners();
  }
}

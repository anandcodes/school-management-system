class MockAuthService {
  Future<bool> login(String email, String password) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));
    // Accept any login for demo
    return true;
  }
}

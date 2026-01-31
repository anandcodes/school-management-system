import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: ListView(
        children: [
          const SizedBox(height: 16),
          Center(
            child: Column(
              children: [
                const CircleAvatar(
                  radius: 40,
                  backgroundColor: Colors.deepPurple,
                  child: Icon(Icons.person, size: 40, color: Colors.white),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Administrator',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                Text(
                  'admin@school.edu',
                  style: TextStyle(color: Colors.grey.shade600),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          _buildSectionHeader('Account'),
          _buildSettingsTile(Icons.person_outline, 'Edit Profile',
              onTap: () {}),
          _buildSettingsTile(Icons.notifications_outlined, 'Notifications',
              onTap: () {}),
          _buildSettingsTile(Icons.lock_outline, 'Privacy & Security',
              onTap: () {}),
          const SizedBox(height: 24),
          _buildSectionHeader('Preferences'),
          _buildSettingsTile(Icons.language, 'Language',
              trailing:
                  const Text('English', style: TextStyle(color: Colors.grey))),
          _buildSettingsTile(Icons.dark_mode_outlined, 'Dark Mode',
              trailing: Switch(value: false, onChanged: (v) {})),
          const SizedBox(height: 24),
          _buildSectionHeader('Support'),
          _buildSettingsTile(Icons.help_outline, 'Help & Support',
              onTap: () {}),
          _buildSettingsTile(Icons.info_outline, 'About App', onTap: () {}),
          const SizedBox(height: 32),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: OutlinedButton.icon(
              onPressed: () {
                Navigator.of(context).popUntil((route) => route.isFirst);
              },
              icon: const Icon(Icons.logout),
              label: const Text('Log Out'),
              style: OutlinedButton.styleFrom(
                foregroundColor: Colors.red,
                side: const BorderSide(color: Colors.red),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Text(
        title.toUpperCase(),
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.bold,
          color: Colors.grey.shade600,
          letterSpacing: 1.2,
        ),
      ),
    );
  }

  Widget _buildSettingsTile(IconData icon, String title,
      {Widget? trailing, VoidCallback? onTap}) {
    return ListTile(
      leading: Icon(icon, color: Colors.grey.shade700),
      title: Text(title),
      trailing: trailing ?? const Icon(Icons.chevron_right, color: Colors.grey),
      onTap: onTap,
    );
  }
}

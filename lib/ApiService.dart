import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile_pegawai/main.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/material.dart';

class Api {
  final String baseUrl = 'http://10.20.30.133:8000/api';

  //Login dan Logout
  Future<Map<String, dynamic>> login(String email, String password) async {
    final url = Uri.parse('$baseUrl/login');
    try {
      final response = await http.post(
        url,
        headers: <String, String>{
          'Content-Type': 'application/json',
        },
        body: jsonEncode(<String, String>{
          'email': email,
          'password': password,
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to login: ${response.statusCode}');
      }
    } catch (e) {
      print('Network error: $e');
      throw Exception('Network error');
    }
  }

  Future<Map<String, dynamic>> logout(String token) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/logout'),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final responseData = jsonDecode(response.body);
        return responseData;
      } else {
        throw Exception('Gagal melakukan logout');
      }
    } catch (e) {
      throw Exception('Error jaringan');
    }
  }

  Future<void> getKaryawanData(String token, BuildContext context) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/karyawan/me'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);

        if (data['status']) {
          Navigator.of(context).pushReplacement(
            MaterialPageRoute(
              builder: (context) => KepegawaianMain(dataKaryawan: data['data']),
            ),
          );
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Failed to fetch karyawan data')),
          );
        }
      } else {
        print('Failed to fetch karyawan data: ${response.statusCode}');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to fetch karyawan data')),
        );
      }
    } catch (e) {
      print('Network error: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Network error')),
      );
    }
  }

  //Absensi
  Future<void> checkIn(int idKaryawan) async {
    DateTime now = DateTime.now();
    String currentTime = '${now.hour.toString()}:${now.minute.toString()}:${now.second.toString()}';
    String currentDate = '${now.year.toString()}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';

    SharedPreferences pref = await SharedPreferences.getInstance();
    final token = pref.getString('token');

    final response = await http.post(
      Uri.parse('$baseUrl/absen/checkin'),
      headers:<String, String> {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'id_karyawan' : idKaryawan,
        'tanggal_absen': currentDate,
        'jam_masuk': currentTime,
        'status': 'Hadir',
      }),
    );

    if (response.statusCode == 200) {
      print('Check-in successful');
    } else if (response.statusCode == 400) {
      throw Exception('Check-in sudah dilakukan hari ini.');
    } else {
      throw Exception('Error saat melakukan absen masuk!');
    }
  }

  Future<void> checkOut(int idAbsen) async {
    DateTime now = DateTime.now();
    String currentTime = '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}:${now.second.toString().padLeft(2, '0')}';

    SharedPreferences pref = await SharedPreferences.getInstance();
    final token = pref.getString('token');

    final response = await http.post(
      Uri.parse('$baseUrl/absen/checkout/$idAbsen'),
      headers:<String, String> {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'jam_keluar' : currentTime,
      }),
    );

    if (response.statusCode == 200) {
      print('Check-out successful');
    } else if (response.statusCode == 400) {
      throw Exception('Check-out sudah dilakukan hari ini.');
    } else {
      throw Exception('Error saat melakukan absen keluar!');
    }
  }
}
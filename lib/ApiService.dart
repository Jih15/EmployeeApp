import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:mobile_pegawai/model/absensi.dart';
import 'package:mobile_pegawai/model/evaluasi.dart';
import 'package:mobile_pegawai/model/gaji.dart';
import 'package:mobile_pegawai/view/menu/pengajuan_menu.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Api {
  final String baseUrl = 'http://10.127.220.6:8000/api';

  Future<String?> getToken() async {
    SharedPreferences pref = await SharedPreferences.getInstance();
    return pref.getString('token');
  }

  // Login dan Logout
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
        final Map<String, dynamic> responseData = jsonDecode(response.body);

        if (responseData['success']) {
          SharedPreferences pref = await SharedPreferences.getInstance();
          pref.setString('token', responseData['token']);
        }

        return responseData;
      } else {
        throw Exception('Failed to login: ${response.statusCode}');
      }
    } catch (e) {
      print('Network error: $e');
      throw Exception('Network error');
    }
  }


  Future<Map<String, dynamic>> logout() async {
    try {
      String? token = await getToken();
      if (token == null) throw Exception('Token tidak ditemukan');

      final response = await http.post(
        Uri.parse('$baseUrl/logout'),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        SharedPreferences pref = await SharedPreferences.getInstance();
        await pref.remove('token');
        await pref.remove('data_karyawan');

        return jsonDecode(response.body);
      } else {
        throw Exception('Gagal melakukan logout');
      }
    } catch (e) {
      throw Exception('Error jaringan: $e');
    }
  }

  Future<Map<String, dynamic>?> getKaryawanData(BuildContext context) async {
    try {
      String? token = await getToken();
      final response = await http.get(
        Uri.parse('$baseUrl/karyawan/me'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final Map<String, dynamic> data = json.decode(response.body);
        if (data['status']) {
          return data['data'];
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Gagal mengambil data karyawan')),
          );
          return null;
        }
      } else {
        print('Gagal mengambil data karyawan: ${response.statusCode}');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Gagal mengambil data karyawan')),
        );
        return null;
      }
    } catch (e) {
      print('Error jaringan: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error jaringan')),
      );
      return null;
    }
  }


  Future<void> updateDataKaryawan(
      String namaDepan,
      String namaBelakang,
      String jenisKelamin,
      DateTime tglLahir,
      String alamat,
      String noTelp,
      String email,
      DateTime tglMasuk,
      String foto) async {
    try {
      String? token = await getToken();
      if (token == null) {
        throw Exception('Token tidak ditemukan');
      }

      final response = await http.put(
        Uri.parse('$baseUrl/karyawan/me'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'nama_depan': namaDepan,
          'nama_belakang': namaBelakang,
          'jenis_kelamin': jenisKelamin,
          'tgl_lahir': tglLahir.toIso8601String(),
          'alamat': alamat,
          'no_telp': noTelp,
          'email': email,
          'tgl_masuk': tglMasuk.toIso8601String(),
          'foto': foto,
        }),
      );

      if (response.statusCode == 200) {
        print('Update data successful');
      } else if (response.statusCode == 400) {
        throw Exception('Update gagal');
      } else {
        throw Exception('Tidak dapat melakukan update');
      }
    } catch (e) {
      print('Error updating data: $e');
      throw e;
    }
  }

  // Absensi
  Future<void> checkIn() async {
    DateTime now = DateTime.now();
    String currentTime = '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}:${now.second.toString().padLeft(2, '0')}';
    String currentDate = '${now.year.toString()}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';

    String status = (now.hour < 8 || (now.hour == 8 && now.minute == 0)) ? 'Hadir' : 'Terlambat';

    try {
      String? token = await getToken();
      if (token == null) {
        throw Exception('Token tidak ditemukan');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/absen/checkin'),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'tanggal_absen': currentDate,
          'jam_masuk': currentTime,
          'status': status,
        }),
      );

      if (response.statusCode == 200) {
        print('Check-in successful');
      } else if (response.statusCode == 400) {
        throw Exception('Check-in sudah dilakukan hari ini.');
      } else {
        throw Exception('Error saat melakukan absen masuk!');
      }
    } catch (e) {
      print('Error checking in: $e');
      throw ('$e');
    }
  }


  Future<void> checkOut() async {
    DateTime now = DateTime.now();
    String currentTime = '${now.hour.toString().padLeft(2, '0')}:${now.minute.toString().padLeft(2, '0')}:${now.second.toString().padLeft(2, '0')}';

    try {
      String? token = await getToken();
      final response = await http.post(
        Uri.parse('$baseUrl/absen/checkout'),
        headers: <String, String>{
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'jam_keluar': currentTime,
        }),
      );

      if (response.statusCode == 200) {
        print('Check-out successful');
      } else if (response.statusCode == 400) {
        throw Exception('Check-out sudah dilakukan hari ini.');
      } else {
        throw Exception('Error saat melakukan absen keluar!');
      }
    } catch (e) {
      print('Error checking out: $e');
      throw Exception('Network error: $e');
    }
  }

  Future<bool> hasCheckedInToday() async {
    try {
      List<Absensi> latestRecords = await getAbsenData();
      DateTime today = DateTime.now();

      for (var record in latestRecords) {
        if (record.jamMasuk != null &&
            record.jamMasuk!.year == today.year &&
            record.jamMasuk!.month == today.month &&
            record.jamMasuk!.day == today.day) {
          return true;
        }
      }
      return false;
    } catch (e) {
      print('Error checking today\'s check-in: $e');
      return false;
    }
  }

  Future<bool> hasCheckedOutToday() async {
    try {
      List<Absensi> latestRecords = await getAbsenData();
      DateTime today = DateTime.now();

      for (var record in latestRecords) {
        if (record.jamKeluar != null &&
            record.jamKeluar!.year == today.year &&
            record.jamKeluar!.month == today.month &&
            record.jamKeluar!.day == today.day) {
          return true;
        }
      }
      return false;
    } catch (e) {
      print('Error checking today\'s check-out: $e');
      return false;
    }
  }

  Future<List<Absensi>> getAbsenData() async {
    try {
      String? token = await getToken();
      if (token == null) throw Exception('Token tidak ditemukan');

      final response = await http.get(
        Uri.parse('$baseUrl/absen/me'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        List<Absensi> absensiList = (data['data_absensi'] as List)
            .map((item) => Absensi.fromJson(item))
            .toList();
        return absensiList;
      } else {
        throw Exception('Failed to load attendance history: ${response.reasonPhrase}');
      }
    } catch (e) {
      print('Error fetching attendance history: $e');
      throw Exception('Network error: $e');
    }
  }

  //Evaluasi
  Future<List<Evaluasi>> getEvaluasiData() async {
    try {
      String? token = await getToken();
      if (token == null) throw Exception('Token tidak ditemukan');

      final response = await http.get(
        Uri.parse('$baseUrl/evaluasi/me'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        List<Evaluasi> evaluasiList = (data['data_evaluasi'] as List)
            .map((item) => Evaluasi.fromJson(item))
            .toList();
        return evaluasiList;
      } else {
        throw Exception('Failed to load attendance history: ${response.reasonPhrase}');
      }
    }catch (e){
      print('Error fetching attendance history: $e');
      throw Exception('Network error: $e');
    }
  }

  //Gaji
  Future<List<Gaji>> getGajiData(BuildContext context) async {
    try {
      String? token = await getToken();
      if (token == null) throw Exception('Token tidak ditemukan');

      final response = await http.get(
        Uri.parse('$baseUrl/gaji/me'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status']) {
          List<Gaji> gajiList = (data['data_gaji'] as List)
              .map((item) => Gaji.fromJson(item))
              .toList();
          return gajiList;
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Gagal mengambil data gaji')),
          );
          return [];
        }
      } else {
        print('Failed to load gaji data: ${response.reasonPhrase}');
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Gagal mengambil data gaji')),
        );
        return [];
      }
    } catch (e) {
      print('Error fetching gaji data: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error jaringan')),
      );
      return [];
    }
  }

  //Cuti
  Future<void> pengajuanCuti(DateTime tanggalMulai, DateTime tanggalSelesai, String keterangan)async{
    try {
      String? token = await getToken();
      if (token == null) {
        throw Exception('Token tidak ditemukan');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/cuti/pengajuan'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'tanggal_mulai' : tanggalMulai,
          'tanggal_selesai' : tanggalSelesai,
          'keterangan' : keterangan
        }),
      );

      if (response.statusCode == 200) {
        print('Pengajuan cuti successful');
      } else if (response.statusCode == 400) {
        throw Exception('Pengajuan gagal');
      } else {
        throw Exception('Tidak dapat melakukan pengajuan');
      }
    } catch (e) {
      print(e);
      throw e;
    }
  }

  //Pelatihan
  Future<void> pengajuanPelatihan(String namaPelatihan, DateTime tanggalPelatihan, String lokasiPelatihan,int lamaPelatihan)async{
    try {
      String? token = await getToken();
      if (token == null) {
        throw Exception('Token tidak ditemukan');
      }

      final response = await http.post(
        Uri.parse('$baseUrl/pelatihan/pengajuan'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode({
          'nama_pelatihan' : namaPelatihan,
          'tgl_pelatihan' : tanggalPelatihan,
          'lokasi_pelatihan' : lokasiPelatihan,
          'lama_pelatihan' : lamaPelatihan
        }),
      );

      if (response.statusCode == 200) {
        print('Pengajuan cuti successful');
      } else if (response.statusCode == 400) {
        throw Exception('Pengajuan gagal');
      } else {
        throw Exception('Tidak dapat melakukan pengajuan');
      }
    } catch (e) {
      print(e);
      throw e;
    }
  }
}

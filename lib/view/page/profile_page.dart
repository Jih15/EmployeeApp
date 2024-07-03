import 'package:flutter/material.dart';
import 'package:mobile_pegawai/ApiService.dart';
import 'package:mobile_pegawai/view/main/login_page.dart';
import 'package:mobile_pegawai/view/menu/evaluasi_menu.dart';
import 'package:mobile_pegawai/view/menu/gaji_menu.dart';
import 'package:mobile_pegawai/view/page/editprofile_page.dart';
import 'package:mobile_pegawai/widget/overview-widget.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfilePage extends StatefulWidget {
  final Map<String, dynamic> dataKaryawan;

  const ProfilePage({Key? key, required this.dataKaryawan}) : super(key: key);

  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  bool _isLoading = false;
  Api apiService = Api();

  Future<void> _logout() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final response = await apiService.logout();

      setState(() {
        _isLoading = false;
      });

      if (response['success'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(response['message'] ?? 'Logout berhasil')),
        );

        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => const LoginPage()),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(response['message'] ?? 'Logout gagal')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Terjadi kesalahan selama logout')),
      );
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profil'),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Hero(
                  tag: 'profile',
                  child: Container(
                    width: 145,
                    height: 145,
                    clipBehavior: Clip.antiAlias,
                    decoration: BoxDecoration(
                      color: Colors.grey,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Image.network(
                      widget.dataKaryawan['foto'],
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${widget.dataKaryawan['nama_depan']} ${widget.dataKaryawan['nama_belakang']}',
                        style: const TextStyle(
                          fontSize: 25,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      Text(
                        '${widget.dataKaryawan['posisi']['nama_posisi']}',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w200,
                        ),
                      ),
                      const SizedBox(height: 20),
                      SizedBox(
                        width: 135,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => EditKaryawan(dataKaryawan: widget.dataKaryawan),
                              ),
                            );
                          },
                          child: const Text(
                            'Edit Account',
                            style: TextStyle(color: Colors.black),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            elevation: 0,
                            foregroundColor: Colors.grey,
                            side: const BorderSide(
                              color: Colors.grey,
                              width: 0.5,
                            ),
                            shape: const RoundedRectangleBorder(
                              borderRadius: BorderRadius.all(Radius.circular(12)),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            const Text(
              'DATA',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 15,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 10),
            OverviewEmployee(), // Widget untuk menampilkan ringkasan data karyawan
            const SizedBox(height: 20),
            const Text(
              'ABOUT ME',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 15,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 10),
            ListTile(
              leading: const Icon(Icons.person),
              title: const Text('Karyawan'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => EditKaryawan(dataKaryawan: widget.dataKaryawan),
                  ),
                ).then((value) {
                  if (value != null && value) {
                    _refreshDataKaryawan();
                  }
                });
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.wallet_rounded),
              title: const Text('Gaji'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                Navigator.of(context).push(
                    MaterialPageRoute(builder: (context) => GajiMenu(),)
                );
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.pie_chart),
              title: const Text('Evaluasi'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (context) => EvaluationMenu()),
                );
              },
            ),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.notifications_on_rounded),
              title: const Text('Notifikasi'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                // Navigasi ke halaman notifikasi
              },
            ),
            const Divider(),
            Center(
              child: SizedBox(
                width: 250,
                height: 55,
                child: ElevatedButton(
                  onPressed: _logout,
                  child: const Text(
                    'Logout',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _refreshDataKaryawan() async {
    try {
      Map<String, dynamic>? fetchedData = await Api().getKaryawanData(context);
      if (fetchedData != null) {
        setState(() {
          widget.dataKaryawan.clear();
          widget.dataKaryawan.addAll(fetchedData);
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Gagal mengambil data karyawan')),
        );
      }
    } catch (e) {
      print('Error mengambil data karyawan: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error jaringan')),
      );
    }
  }
}

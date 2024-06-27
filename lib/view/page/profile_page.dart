import 'package:flutter/material.dart';
import 'package:mobile_pegawai/ApiService.dart';
import 'package:mobile_pegawai/view/main/login_page.dart';
import 'package:mobile_pegawai/view/page/editprofile_page.dart';
import 'package:mobile_pegawai/widget/overview-widget.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ProfilePage extends StatefulWidget {
  final Map<String, dynamic> dataKaryawan;

  const ProfilePage({super.key, required this.dataKaryawan});

  @override
  State<ProfilePage> createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {

  bool _isLoading = false;
  Api apiService = Api();

  Future<void> _logout() async {
    setState(() {
      _isLoading = true;
    });

    try {
      SharedPreferences pref = await SharedPreferences.getInstance();
      String? token = pref.getString('token');

      final response = await apiService.logout(token!);

      setState(() {
        _isLoading = false;
      });

      if (response['success'] == true) {
        await pref.remove('token');
        await pref.remove('data_karyawan');

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
      body: SizedBox(
        width: double.infinity,
        height: double.infinity,
        child: Padding(
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
                        boxShadow: const [],
                        color: Colors.grey,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Image.network(
                        widget.dataKaryawan['foto'],
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  SizedBox(width: 20,),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${widget.dataKaryawan['nama_depan']}'+' '+'${widget.dataKaryawan['nama_belakang']}',
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
                      SizedBox(height: 20,),
                      SizedBox(
                        width: 120,
                        height: 50,
                        child: ElevatedButton(
                          onPressed: (){
                            Navigator.of(context).push(
                              MaterialPageRoute(builder: (context) => EditProfile(dataKaryawan: widget.dataKaryawan)),
                            );
                          },
                          child: Text(
                            'Edit Profile',
                            style: TextStyle(
                              color: Colors.black
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            elevation: 0,
                            foregroundColor: Colors.grey,
                            side: BorderSide(
                              color: Colors.grey,
                              width: 0.5,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12)
                            )
                          ),
                        ),
                      )
                    ],
                  )
                ],
              ),
              SizedBox(height: 20,),
              const Text(
                'DATA',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                ),
              ),
              SizedBox(height: 10,),
              OverviewEmployee(),
              SizedBox(height: 20,),
              const Text(
                'ABOUT ME',
                style: TextStyle(
                  color: Colors.grey,
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                ),
              ),
              ListView(
                shrinkWrap: true,
                physics: NeverScrollableScrollPhysics(),
                children: [
                  ListTile(
                    leading: Icon(Icons.wallet_rounded),
                    title: Text('Gaji'),
                    trailing: Icon(Icons.chevron_right),
                    onTap: () {

                    },
                  ),
                  Divider(),
                  ListTile(
                    leading: Icon(Icons.pie_chart),
                    title: Text('Evaluasi'),
                    trailing: Icon(Icons.chevron_right),
                    onTap: () {

                    },
                  ),
                  Divider(),
                  ListTile(
                    leading: Icon(Icons.notifications_on_rounded),
                    title: Text('Notifikasi'),
                    trailing: Icon(Icons.chevron_right),
                    onTap: () {

                    },
                  ),
                ],
              ),
              Center(
                child: SizedBox(
                  width: 250,
                  height: 55,
                  child: ElevatedButton(
                    onPressed: () {
                      _logout();
                    },
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
                        borderRadius: BorderRadius.circular(12)
                      )
                    ),
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}

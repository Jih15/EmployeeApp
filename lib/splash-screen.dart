import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:mobile_pegawai/dashboard-page.dart';
import 'package:mobile_pegawai/login-page.dart';
import 'package:mobile_pegawai/main.dart';
import 'package:mobile_pegawai/model/evaluasi.dart';
import 'package:mobile_pegawai/model/gaji.dart';
import 'package:mobile_pegawai/model/karyawan.dart';
import 'package:mobile_pegawai/model/user.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {

  @override
  void initState(){
    super.initState();
    _checkLoginStatus();
  }

  Future<void> _checkLoginStatus() async {
    SharedPreferences pref = await SharedPreferences.getInstance();
    String? userDataString = pref.getString('user');
    String? karyawanDataString = pref.getString('karyawan');
    String? gajiDataString = pref.getString('gaji');
    String? evaluasiDataString = pref.getString('evaluasi');

    if (userDataString != null
        && karyawanDataString != null
        && gajiDataString != null
        && evaluasiDataString != null) {
      User user = User.fromJson(jsonDecode(userDataString));
      Karyawan karyawan = Karyawan.fromJson(jsonDecode(karyawanDataString));
      Gaji gaji = Gaji.fromJson(jsonDecode(gajiDataString));
      Evaluasi evaluasi = Evaluasi.fromJson(jsonDecode(evaluasiDataString));

      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (context)=> KepegawaianMain(
            user: user,
            karyawan: karyawan,
            gaji: gaji,
            evaluasi: evaluasi,
          ),
        )
      );
    }else {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (context)=> LoginPage(),
        )
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: EdgeInsets.all(30),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.all(30),
                child: Image.asset(
                  'assets/img/logo.png',
                  scale: (1/0.6),
                ),
              ),
              LinearProgressIndicator()
            ],
          ),
        ),
      )
    );
  }
}

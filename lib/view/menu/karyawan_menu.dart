import 'package:flutter/material.dart';

class KaryawanMenu extends StatelessWidget {
  const KaryawanMenu({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Karyawan Page'),
        centerTitle: true,
      ),
      body: Container(
        height: double.maxFinite,
        width: double.maxFinite,
        color: Colors.green,
      ),
    );
  }
}

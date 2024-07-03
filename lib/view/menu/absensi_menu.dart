import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile_pegawai/ApiService.dart';
import 'package:mobile_pegawai/model/absensi.dart';

class AbsensiMenu extends StatelessWidget {
  const AbsensiMenu({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Daftar Absensi'),
      ),
      body: FutureBuilder<List<Absensi>>(
        future: Api().getAbsenData(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('Tidak ada data absensi.'));
          } else {
            List<Absensi> absensiList = snapshot.data!;
            return ListView.builder(
              itemCount: absensiList.length,
              itemBuilder: (context, index) {
                Absensi absensi = absensiList[index];
                return Card(
                  child: ListTile(
                    title: Text('${DateFormat('dd MMM yyyy').format(absensi.tanggalAbsen)}'),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Jam Masuk: ${absensi.jamMasuk != null ? DateFormat('HH:mm:ss').format(absensi.jamMasuk!) : '-'}'),
                        Text('Jam Masuk: ${absensi.jamKeluar != null ? DateFormat('HH:mm:ss').format(absensi.jamKeluar!) : '-'}'),
                      ],
                    ),
                    trailing: Text('Status: ${absensi.status}'),
                  ),
                );
              },
            );
          }
        },
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:mobile_pegawai/view/menu/absensi_menu.dart';
import 'package:mobile_pegawai/view/menu/evaluasi_menu.dart';
import 'package:mobile_pegawai/view/menu/gaji_menu.dart';
import 'package:mobile_pegawai/view/menu/karyawan_menu.dart';
import 'package:mobile_pegawai/view/menu/pengajuan_menu.dart';

class MenuPage extends StatelessWidget {

  final Map<String, dynamic> dataKaryawan;

  const MenuPage({Key? key, required this.dataKaryawan}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        InkWell(
          onTap: () {
            Navigator.of(context).push(
              MaterialPageRoute(builder: (context) => EvaluationMenu()),
            );
          },
          child: Column(
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                    color: const Color.fromRGBO(224, 230, 234, 1),
                    borderRadius: BorderRadius.circular(10)
                ),
                child: Image.asset(
                  'assets/ico/evaluasi.png',
                  scale: (1/0.7),
                ),
              ),
              const Text('Evaluasi')
            ],
          ),
        ),
        // const Spacer(),
        // InkWell(
        //   onTap: () {
        //     Navigator.of(context).push(
        //         MaterialPageRoute(builder: (context) => const KaryawanMenu(),)
        //     );
        //   },
        //   child: Column(
        //     children: [
        //       Container(
        //         width: 80,
        //         height: 80,
        //         decoration: BoxDecoration(
        //             color: const Color.fromRGBO(224, 230, 234, 1),
        //             borderRadius: BorderRadius.circular(10)
        //         ),
        //         child: Image.asset(
        //           'assets/ico/saya.png',
        //           scale: (1/0.7),
        //         ),
        //       ),
        //       const Text('Karyawan')
        //     ],
        //   ),
        // ),
        const Spacer(),
        InkWell(
          onTap: () {
            Navigator.of(context).push(
                MaterialPageRoute(builder: (context) => const AbsensiMenu(),)
            );
          },
          child: Column(
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                    color: const Color.fromRGBO(224, 230, 234, 1),
                    borderRadius: BorderRadius.circular(10)
                ),
                child: Image.asset(
                  'assets/ico/absensi.png',
                  scale: (1/0.7),
                ),
              ),
              const Text('Absensi')
            ],
          ),
        ),
        const Spacer(),
        InkWell(
          onTap: () {
            Navigator.of(context).push(
                MaterialPageRoute(builder: (context) => const PengajuanMenu(),)
            );
          },
          child: Column(
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                    color: const Color.fromRGBO(224, 230, 234, 1),
                    borderRadius: BorderRadius.circular(10)
                ),
                child: Image.asset(
                  'assets/ico/pengajuan.png',
                  scale: (1/0.7),
                ),
              ),
              const Text('Pengajuan')
            ],
          ),
        ),
        const Spacer(),
        InkWell(
          onTap: () {
            Navigator.of(context).push(
                MaterialPageRoute(builder: (context) => GajiMenu(),)
            );
          },
          child: Column(
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: BoxDecoration(
                    color: const Color.fromRGBO(224, 230, 234, 1),
                    borderRadius: BorderRadius.circular(10)
                ),
                child: Image.asset(
                  'assets/ico/gaji.png',
                  scale: (1/0.7),
                ),
              ),
              const Text('Gaji')
            ],
          ),
        ),
      ],
    );
  }
}

import 'package:flutter/material.dart';
import 'package:mobile_pegawai/view/menu/evaluasi_menu.dart';

class EvaluationWidget extends StatelessWidget {
  final Map<String, dynamic> dataKaryawan;

  const EvaluationWidget({Key? key, required this.dataKaryawan}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // Cari nilai evaluasi terbaru
    double nilai = 0.0;
    String? tanggalTerbaru;

    if (dataKaryawan['evaluasi'] != null && dataKaryawan['evaluasi'].isNotEmpty) {
      final List<dynamic> evaluasiList = dataKaryawan['evaluasi'];
      final latestEvaluasi = evaluasiList.last;
      nilai = double.tryParse(latestEvaluasi['penilaian_kinerja'].toString()) ?? 0.0;
      tanggalTerbaru = latestEvaluasi['tahun_evaluasi'].toString();
    }

    return Container(
      width: double.maxFinite,
      height: 180,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: const Color.fromRGBO(207, 207, 207, 1),
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              children: [
                Text(
                  '${_formatNilai(nilai)}/100',
                  style: const TextStyle(
                    fontSize: 35,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const Spacer(),
                IconButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (context) => EvaluationMenu(dataKaryawan: dataKaryawan),),
                    );
                  },
                  icon: const Icon(
                    Icons.more_horiz_rounded,
                    size: 30,
                  ),
                ),
              ],
            ),
            Row(
              children: [
                const Icon(
                  Icons.show_chart,
                  color: Color.fromRGBO(16, 132, 139, 1),
                ),
                Text(
                  '${_formatNilai(nilai)}%',
                  style: const TextStyle(
                    fontSize: 16,
                    color: Color.fromRGBO(16, 132, 139, 1),
                  ),
                ),
                const Text(
                  ' Meningkat',
                  style: TextStyle(
                    fontSize: 16,
                  ),
                ),
              ],
            ),
            const Spacer(),
            Row(
              children: [
                const Text(
                  'Rate',
                  style: TextStyle(color: Colors.grey),
                ),
                const Spacer(),
                Text(
                  '${_formatNilai(nilai)}/100',
                  style: const TextStyle(color: Colors.grey),
                )
              ],
            ),
            LinearProgressIndicator(
              borderRadius: const BorderRadius.all(Radius.circular(20)),
              minHeight: 10,
              value: nilai / 100,
              valueColor: AlwaysStoppedAnimation<Color>(
                _getNilaiEvaluasi(nilai.toDouble()),
              ),
            ),
            if (tanggalTerbaru != null)
              Padding(
                padding: const EdgeInsets.only(top: 8.0),
                child: Text(
                  'Evaluasi terbaru pada: $tanggalTerbaru',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 12,
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Color _getNilaiEvaluasi(double value) {
    return Color.lerp(
      const Color.fromRGBO(232, 89, 89, 1.0),
      const Color.fromRGBO(16, 132, 139, 1),
      value / 100,
    ) ??
        Colors.grey;
  }

  String _formatNilai(double nilai) {
    if (nilai == nilai.roundToDouble()) {
      return nilai.toInt().toString();
    }
    return nilai.toStringAsFixed(1);
  }
}

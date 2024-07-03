import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile_pegawai/ApiService.dart';
import 'package:mobile_pegawai/model/evaluasi.dart';
import 'package:mobile_pegawai/view/menu/evaluasi_menu.dart';

class EvaluationWidget extends StatefulWidget {
  const EvaluationWidget({Key? key}) : super(key: key);

  @override
  State<EvaluationWidget> createState() => _EvaluationWidgetState();
}

class _EvaluationWidgetState extends State<EvaluationWidget> {
  List<Evaluasi> evaluasiList = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchEvaluasiData();
  }

  Future<void> _fetchEvaluasiData() async {
    try {
      List<Evaluasi> data = await Api().getEvaluasiData();
      setState(() {
        evaluasiList = data;
        isLoading = false;
      });
    } catch (e) {
      print('Error fetching evaluasi data: $e');
      setState(() {
        isLoading = false;
      });
    }
  }

  double _calculateAverageRating(List<Evaluasi> evaluasiList) {
    if (evaluasiList.isEmpty) return 0.0;

    double totalRating = 0;
    for (var evaluasi in evaluasiList) {
      totalRating += evaluasi.penilaianKinerja.toDouble();
    }

    return totalRating / evaluasiList.length;
  }

  @override
  Widget build(BuildContext context) {
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
                  '${_calculateAverageRating(evaluasiList).toStringAsFixed(1)}/100',
                  style: const TextStyle(
                    fontSize: 35,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const Spacer(),
                IconButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (context) => EvaluationMenu()),
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
                if (evaluasiList.length > 1)
                  Text(
                    evaluasiList.last.penilaianKinerja.toDouble() > evaluasiList[evaluasiList.length - 2].penilaianKinerja.toDouble() ? ' Meningkat' : ' Menurun',
                    style: TextStyle(
                      fontSize: 16,
                      color: evaluasiList.length > 1
                          ? evaluasiList.last.penilaianKinerja.toDouble() > evaluasiList[evaluasiList.length - 2].penilaianKinerja.toDouble()
                          ? Color.fromRGBO(16, 132, 139, 1)
                          : const Color.fromRGBO(232, 89, 89, 1)
                          : Colors.black,
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
                  '${_calculateAverageRating(evaluasiList).toStringAsFixed(1)}/100',
                  style: const TextStyle(color: Colors.grey),
                )
              ],
            ),
            LinearProgressIndicator(
              borderRadius: const BorderRadius.all(Radius.circular(20)),
              minHeight: 10,
              value: _calculateAverageRating(evaluasiList) / 100,
              valueColor: AlwaysStoppedAnimation<Color>(
                _getNilaiEvaluasi(_calculateAverageRating(evaluasiList)),
              ),
            ),
            if (evaluasiList.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 8.0),
                child: Text(
                  'Evaluasi terbaru pada: ${DateFormat('dd MMM yyyy').format(evaluasiList.last.tahunEvaluasi)}',
                  style: const TextStyle(
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
}

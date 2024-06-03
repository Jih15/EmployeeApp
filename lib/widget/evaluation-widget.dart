import 'package:flutter/material.dart';
import 'package:mobile_pegawai/model/evaluasi.dart';

class EvaluationWidget extends StatelessWidget {

  final Evaluasi evaluasi;

  EvaluationWidget({Key? key, required this.evaluasi}) : super(key: key);

  @override
  Widget build(BuildContext context) {

    double nilaiEvaluasi = evaluasi.penilaianKinerja;

    return Container(
      width: double.maxFinite,
      height: 150,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Color.fromRGBO(207, 207, 207, 1),
        ),
      ),
      child: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              children: [
                Text(
                  '${evaluasi.penilaianKinerja.toStringAsFixed(0)}/${evaluasi.penilaianKinerja}',
                  style: TextStyle(
                    fontSize: 35,
                    fontWeight: FontWeight.w700
                  ),
                ),
                Spacer(),
                IconButton(
                  onPressed: (){},
                  icon: Icon(
                    Icons.more_horiz_rounded,
                    size: 30,
                  ),
                ),
              ],
            ),
            Row(
              children: [
                Icon(
                  Icons.show_chart,
                  color: Color.fromRGBO(16, 132, 139, 1),
                ),
                Text(
                  '${nilaiEvaluasi.toStringAsFixed(0)}%',
                  style: TextStyle(
                    fontSize: 16,
                    color: Color.fromRGBO(16, 132, 139, 1),
                  ),
                ),
                Text(
                  ' ${evaluasi.penilaianKinerja}',
                  style: TextStyle(
                    fontSize: 16,
                  ),
                )
              ],
            ),
            Spacer(),
            Row(
              children: [
                Text(
                  'Rate',
                  style: TextStyle(
                    color: Colors.grey
                  ),
                ),
                Spacer(),
                Text(
                  '${nilaiEvaluasi.toStringAsFixed(0)}/${evaluasi.penilaianKinerja}',
                  style: TextStyle(
                      color: Colors.grey
                  ),
                )
              ],
            ),
            LinearProgressIndicator(
              borderRadius: BorderRadius.all(
                Radius.circular(20)
              ),
              minHeight: 10,
              value: nilaiEvaluasi / 100,
              valueColor: AlwaysStoppedAnimation<Color>(_getNilaiEvaluasi(nilaiEvaluasi)),
            )
          ],
        ),
      ),
    );
  }
  Color _getNilaiEvaluasi(double value){
    return Color.lerp(Color.fromRGBO(232, 89, 89, 1.0), Color.fromRGBO(16, 132, 139, 1), value/100)!;
  }
}

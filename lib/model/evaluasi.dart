import 'package:intl/intl.dart';

class Evaluasi {
  final int idEvaluasi;
  final int idKaryawan;
  final DateTime tahunEvaluasi;
  final double penilaianKinerja;
  final String catatan;

  Evaluasi({
    required this.idEvaluasi,
    required this.idKaryawan,
    required this.tahunEvaluasi,
    required this.penilaianKinerja,
    required this.catatan,
  });

  factory Evaluasi.fromJson(Map<String, dynamic> json) {
    return Evaluasi(
      idEvaluasi: json['id_evaluasi'],
      idKaryawan: json['id_karyawan'],
      tahunEvaluasi: DateFormat('yyyy-MM-dd').parse(json['tahun_evaluasi']),
      penilaianKinerja: json['penilaian_kinerja'] is String
          ? double.tryParse(json['penilaian_kinerja']) ?? 0.0
          : json['penilaian_kinerja'].toDouble(),
      catatan: json['catatan'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id_evaluasi': idEvaluasi,
      'id_karyawan': idKaryawan,
      'tahun_evaluasi': DateFormat('yyyy-MM-dd').format(tahunEvaluasi),
      'penilaian_kinerja': penilaianKinerja,
      'catatan': catatan,
    };
  }
}

class Evaluasi {
  final int idEvaluasi;
  final String tahunEvaluasi;
  final double penilaianKinerja;
  final String catatan;

  Evaluasi({
    required this.idEvaluasi,
    required this.tahunEvaluasi,
    required this.penilaianKinerja,
    required this.catatan
  });

  factory Evaluasi.fromJson(Map<String, dynamic> json) {
    return Evaluasi(
      idEvaluasi: json['id_evaluasi'],
      tahunEvaluasi: json['tahun_evaluasi'],
      penilaianKinerja: double.parse(json['penilaian_kinerja']),
      catatan: json['catatan'],
    );
  }
}

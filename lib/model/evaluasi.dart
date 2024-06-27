class Evaluasi {
  final int idEvaluasi;
  final int idKaryawan;
  final DateTime tahunEvaluasi;
  final int penilaianKinerja;
  final String catatan;

  Evaluasi({
    required this.idEvaluasi,
    required this.idKaryawan,
    required this.tahunEvaluasi,
    required this.penilaianKinerja,
    required this.catatan
  });

  factory Evaluasi.fromJson(Map<String, dynamic> json){
    return Evaluasi(
      idEvaluasi: json['id_evaluasi'],
      idKaryawan: json['id_karyawan'],
      tahunEvaluasi: json['tahun_evaluasi'],
      penilaianKinerja: json['penilaian_kinerja'],
      catatan: json['catatan'],
    );
  }

  Map<String, dynamic> toJson(){
    return {
      'id_evaluasi' : idEvaluasi,
      'id_karyawan' : idKaryawan,
      'tahun_evaluasi' : tahunEvaluasi,
      'penilaian_kinerja' : penilaianKinerja,
      'catatan' : catatan
    };
  }
}
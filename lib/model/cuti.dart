class Cuti{
  final int idCuti;
  final int idKaryawan;
  final DateTime tglMulai;
  final DateTime tglSelesai;
  final String keteranganCuti;
  final int jatahCuti;
  final String status;

  Cuti({
    required this.idCuti,
    required this.idKaryawan,
    required this.tglMulai,
    required this.tglSelesai,
    required this.keteranganCuti,
    required this.jatahCuti,
    required this.status
  });

  factory Cuti.fromJson(Map<String, dynamic> json){
    return Cuti(
      idCuti: json['id_cuti'],
      idKaryawan: json['id_karyawan'],
      tglMulai: json['tgl_mulai'],
      tglSelesai: json['tgl_selesai'],
      keteranganCuti: json['keterangan_cuti'],
      jatahCuti: json['jatah_cuti'],
      status: json['status'],
    );
  }

  Map<String,dynamic> toJson(){
    return {
      'id_cuti' : idCuti,
      'id_karyawan' : idKaryawan,
      'tgl_mulai' : tglMulai,
      'tgl_selesai' : tglSelesai,
      'keterangan_cuti' : keteranganCuti,
      'jatah_cuti' : jatahCuti,
      'status' : status
    };
  }
}
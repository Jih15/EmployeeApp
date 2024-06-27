class Absensi {
  final int idAbsen;
  final int idKaryawan;
  final DateTime tanggal_absen;
  final DateTime? jam_masuk;
  final DateTime? jam_keluar;
  final String status;

  Absensi({
    required this.idAbsen,
    required this.idKaryawan,
    required this.tanggal_absen,
    this.jam_masuk,
    this.jam_keluar,
    required this.status
  });

  factory Absensi.fromJson(Map<String, dynamic> json){
    return Absensi(
      idAbsen: json['id_absen'],
      idKaryawan: json['id_karyawan'],
      tanggal_absen: json['tanggal_absen'],
      jam_masuk: json['jam_masuk'],
      jam_keluar: json['jam_keluar'],
      status: json['status'],
    );
  }
}
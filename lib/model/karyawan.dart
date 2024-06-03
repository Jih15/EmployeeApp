class Karyawan {
  final int idKaryawan;
  final String namaDepan;
  final String namaBelakang;
  final String email;

  Karyawan({
    required this.idKaryawan,
    required this.namaDepan,
    required this.namaBelakang,
    required this.email
  });

  factory Karyawan.fromJson(Map<String, dynamic> json) {
    return Karyawan(
      idKaryawan: json['id_karyawan'],
      namaDepan: json['nama_depan'],
      namaBelakang: json['nama_belakang'],
      email: json['email'],
    );
  }
}

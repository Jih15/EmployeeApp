import 'posisi.dart';

class Karyawan {
  int idKaryawan;
  int idUser;
  String namaDepan;
  String namaBelakang;
  int idPosisi;
  int idManager;
  String jenisKelamin;
  DateTime tglLahir;
  String alamat;
  String noTelp;
  String email;
  DateTime tglMasuk;
  String foto;
  Posisi posisi;

  Karyawan({
    required this.idKaryawan,
    required this.idUser,
    required this.namaDepan,
    required this.namaBelakang,
    required this.idPosisi,
    required this.idManager,
    required this.jenisKelamin,
    required this.tglLahir,
    required this.alamat,
    required this.noTelp,
    required this.email,
    required this.tglMasuk,
    required this.foto,
    required this.posisi,
  });

  factory Karyawan.fromJson(Map<String, dynamic> json) {
    return Karyawan(
      idKaryawan: json['id_karyawan'],
      idUser: json['id_user'],
      namaDepan: json['nama_depan'],
      namaBelakang: json['nama_belakang'],
      idPosisi: json['id_posisi'],
      idManager: json['id_manager'],
      jenisKelamin: json['jenis_kelamin'],
      tglLahir: DateTime.parse(json['tgl_lahir']),
      alamat: json['alamat'],
      noTelp: json['no_telp'],
      email: json['email'],
      tglMasuk: DateTime.parse(json['tgl_masuk']),
      foto: json['foto'],
      posisi: Posisi.fromJson(json['posisi']),
    );
  }
}

class Gaji{
  final int idGaji;
  final int idKaryawan;
  final int gajiPokok;
  final int tunjangan;
  final int bonus;
  final int potongan;
  final int totalGaji;
  final DateTime tanggalPenggajian;

  Gaji({
    required this.idGaji,
    required this.idKaryawan,
    required this.gajiPokok,
    required this.tunjangan,
    required this.bonus,
    required this.potongan,
    required this.totalGaji,
    required this.tanggalPenggajian
  });

  factory Gaji.fromJson(Map<String, dynamic> json){
    return Gaji(
      idGaji: json['id_gaji'],
      idKaryawan: json['id_karyawan'],
      gajiPokok: json['gaji_pokok'],
      tunjangan: json['tunjangan'],
      bonus: json['bonus'],
      potongan: json['potongan'],
      totalGaji: json['total_gaji'],
      tanggalPenggajian: json['tanggal_penggajian'],
    );
  }

  Map<String, dynamic> toJson(){
    return {
      'id_gaji' : idGaji,
      'id_karyawan' : idKaryawan,
      'gaji_pokok' : gajiPokok,
      'tunjangan' : tunjangan,
      'bonus' : bonus,
      'potongan' : potongan,
      'total_gaji' : totalGaji,
      'tanggal_penggajian' : tanggalPenggajian
    };
  }
}
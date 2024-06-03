class Gaji {
  final int idGaji;
  final int gajiPokok;
  final int tunjangan;
  final int bonus;
  final int potongan;
  final int totalGaji;

  Gaji({
    required this.idGaji,
    required this.gajiPokok,
    required this.tunjangan,
    required this.bonus,
    required this.potongan,
    required this.totalGaji,
  });

  factory Gaji.fromJson(Map<String, dynamic> json){
    return Gaji(
      idGaji: json['id_gaji'],
      gajiPokok: json['gaji_pokok'],
      tunjangan: json['tunjangan'],
      bonus: json['bonus'],
      potongan: json['potongan'],
      totalGaji: json['total_gaji'],
    );
  }
}
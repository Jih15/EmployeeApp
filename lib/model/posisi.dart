class Posisi{
  final int idPosisi;
  final int idDepartment;
  final String namaPosisi;
  final int gajiPokok;

  Posisi({
    required this.idPosisi,
    required this.idDepartment,
    required this.namaPosisi,
    required this.gajiPokok
  });

  factory Posisi.fromJson(Map<String, dynamic> json){
    return Posisi(
      idPosisi: json['id_posisi'],
      idDepartment: json['id_department'],
      namaPosisi: json['nama_posisi'],
      gajiPokok: json['gaji_pokok'],
    );
  }
  Map<String, dynamic> toJson(){
    return {
      'id_posisi' : idPosisi,
      'id_department' : idDepartment,
      'nama_posisi' : namaPosisi,
      'gaji_pokok' : gajiPokok
    };
  }
}
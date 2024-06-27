class Pelatihan{
  final int idPelatihan;
  final int idKaryawan;
  final String namaPelatihan;
  final DateTime tglPelatihan;
  final String lokasiPelatihan;
  final int lamaPelatihan;

  Pelatihan({
    required this.idPelatihan,
    required this.idKaryawan,
    required this.namaPelatihan,
    required this.tglPelatihan,
    required this.lokasiPelatihan,
    required this.lamaPelatihan
  });

  factory Pelatihan.fromJson(Map<String, dynamic> json){
    return Pelatihan(
      idPelatihan: json['id_pelatihan'],
      idKaryawan: json['id_karyawan'],
      namaPelatihan: json['nama_pelatihan'],
      tglPelatihan: json['tgl_pelatihan'],
      lokasiPelatihan: json['lokasi_pelatihan'],
      lamaPelatihan: json['lama_pelatihan'],
    );
  }

  Map<String, dynamic> toJson(){
    return {
      'id_pelatihan' : idPelatihan,
      'id_karyawan' : idKaryawan,
      'nama_pelatihan' : namaPelatihan,
      'tgl_pelatihan' : tglPelatihan,
      'lokasi_pelatihan' : lokasiPelatihan,
      'lama_pelatihan' : lamaPelatihan
    };
  }
}
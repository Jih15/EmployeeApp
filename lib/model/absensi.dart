class Absensi {
  final int idAbsen;
  final int idKaryawan;
  final DateTime tanggalAbsen;
  final DateTime? jamMasuk;
  final DateTime? jamKeluar;
  final String status;

  Absensi({
    required this.idAbsen,
    required this.idKaryawan,
    required this.tanggalAbsen,
    this.jamMasuk,
    this.jamKeluar,
    required this.status,
  });

  factory Absensi.fromJson(Map<String, dynamic> json) {
    return Absensi(
      idAbsen: json['id_absen'],
      idKaryawan: json['id_karyawan'],
      tanggalAbsen: DateTime.parse(json['tanggal_absen']),
      jamMasuk: json['jam_masuk'] != null ? parseTime(json['jam_masuk']) : null,
      jamKeluar: json['jam_keluar'] != null ? parseTime(json['jam_keluar']) : null,
      status: json['status'],
    );
  }

  static DateTime? parseTime(String? timeString) {
    if (timeString == null) return null;
    try {
      // Misalnya, jika format jam adalah "HH:mm:ss"
      final parts = timeString.split(':');
      final hour = int.parse(parts[0]);
      final minute = int.parse(parts[1]);
      final second = int.parse(parts[2]);
      return DateTime(DateTime.now().year, DateTime.now().month, DateTime.now().day, hour, minute, second);
    } catch (e) {
      print('Error parsing time: $e');
      return null;
    }
  }
}

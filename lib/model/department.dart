class Department {
  final int idDepartment;
  final String namaDepartment;
  final String deskripsi;

  Department({
    required this.idDepartment,
    required this.namaDepartment,
    required this.deskripsi
  });

  factory Department.fromJson(Map<String, dynamic> json){
    return Department(
      idDepartment: json['id_department'],
      namaDepartment: json['nama_department'],
      deskripsi: json['deskripsi'],
    );
  }

  Map<String, dynamic> toJson(){
    return {
      'id_department' : idDepartment,
      'nama_department' : namaDepartment,
      'deskripsi' : deskripsi
    };
  }
}
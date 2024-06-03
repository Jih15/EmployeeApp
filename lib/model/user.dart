class User {
  final int idUser;
  final String username;
  final String email;
  final String hakAkses;

  User({
    required this.idUser,
    required this.username,
    required this.email,
    required this.hakAkses
  });

  factory User.fromJson(Map<String, dynamic> json){
    return User(
        idUser: json['id_user'],
        username: json['username'],
        email: json['email'],
        hakAkses: json['hak_akses']
    );
  }
}
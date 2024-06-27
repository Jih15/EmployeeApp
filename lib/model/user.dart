class User {
  final int id;
  final String username;
  final String email;
  final String hakAkses;

  User({
    required this.id,
    required this.username,
    required this.email,
    required this.hakAkses,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id_user'],
      username: json['username'],
      email: json['email'],
      hakAkses: json['hak_akses'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id_user': id,
      'username': username,
      'email': email,
      'hak_akses': hakAkses,
    };
  }
}

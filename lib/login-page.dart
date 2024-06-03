import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_pegawai/main.dart';
import 'package:mobile_pegawai/model/evaluasi.dart';
import 'package:mobile_pegawai/model/gaji.dart';
import 'package:mobile_pegawai/model/karyawan.dart';
import 'package:mobile_pegawai/model/user.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {

  TextEditingController _emailController = TextEditingController();
  TextEditingController _passwordController = TextEditingController();
  bool _isObscured = true;
  bool _isLoading = false;

  Future<void> _loginPegawai() async {
    setState(() {
      _isLoading = true;
    });
    final response = await http.post(
      Uri.parse('http://10.126.224.189:8000/api/login'),
      headers: <String, String>{
        'Content-Type': 'application/json',
      },
      body: jsonEncode(<String, String>{
        'email': _emailController.text,
        'password': _passwordController.text,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      SharedPreferences pref = await SharedPreferences.getInstance();
      await pref.setString('token', data['token']);
      await pref.setString('user', jsonEncode(data['user']));
      await pref.setString('karyawan', jsonEncode(data['karyawan']));
      await pref.setString('gaji', jsonEncode(data['gaji']));
      await pref.setString('evaluasi', jsonEncode(data['evaluasi']));

      Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (context) => KepegawaianMain(
            user: User.fromJson(data['user']),
            karyawan: Karyawan.fromJson(data['karyawan']),
            gaji: Gaji.fromJson(data['gaji']),
            evaluasi: Evaluasi.fromJson(data['evaluasi']),
          ))
      );
    } else {
      final data = jsonDecode(response.body);
      String errorMessage = data['message'] ?? 'An error occurred during login';
      if (response.statusCode == 422) {
        errorMessage = 'Invalid login details';
      } else if (response.statusCode == 403) {
        errorMessage = 'Unauthorized: ${data['message']}';
      }
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(errorMessage)),
      );
    }

    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(height: 40,),
                Center(
                    child: Image.asset('assets/img/logo.png',
                    scale: (1/0.45),)
                ),
                SizedBox(height: 60,),
                Text(
                  'Login',
                  style: TextStyle(
                    fontSize: 52,
                    fontWeight: FontWeight.w700,
                    height: 0,
                  ),
                ),
                Text(
                  'Welcome back!',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w300,
                    height: 0,
                  ),
                ),
                SizedBox(height: 70,),
                TextField(
                  controller: _emailController,
                  decoration: InputDecoration(
                    prefixIcon: Icon(
                      Icons.email_outlined,
                      color: Color.fromRGBO(52, 119, 167, 1),
                    ),
                    filled: true,
                    fillColor: Color.fromRGBO(224, 230, 234, 1),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide.none
                    ),
                    hintText: 'Email',
                    hintStyle: TextStyle(
                      color: Color.fromRGBO(91, 95, 98, 1),
                      fontSize: 16,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w400,
                  ),
                ),
                SizedBox(height: 15,),
                TextField(
                  controller: _passwordController,
                  obscureText: _isObscured,
                  decoration: InputDecoration(
                    prefixIcon: Icon(
                      Icons.lock_outline,
                      color: Color.fromRGBO(52, 119, 167, 1),
                    ),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _isObscured ? Icons.visibility : Icons.visibility_off,
                        color: Color.fromRGBO(52, 119, 167, 1),
                      ),
                      onPressed: (){
                        setState(() {
                          _isObscured = !_isObscured;
                        });
                      },
                    ),
                    filled: true,
                    fillColor: Color.fromRGBO(224, 230, 234, 1),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide: BorderSide.none
                    ),
                    hintText: 'Password',
                    hintStyle: TextStyle(
                      color: Color.fromRGBO(91, 95, 98, 1),
                      fontSize: 16,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w400,
                  ),
                ),
                SizedBox(height: 80,),
                Center(
                    child: Column(
                      children: [
                        SizedBox(
                          width: 250,
                          height: 55,
                          child : ElevatedButton(
                            onPressed: _loginPegawai,
                            child: Text(
                              'Login',
                              style: TextStyle(
                                  fontSize: 18,
                                  color: Colors.white,
                                  fontWeight: FontWeight.w500
                              ),
                            ),
                            style: ElevatedButton.styleFrom(
                                shape: RoundedRectangleBorder(
                                    borderRadius:BorderRadius.circular(12)
                                ),
                                elevation: 4,
                                backgroundColor: Color.fromRGBO(32, 154, 207, 1)
                            ),
                          ),
                        ),
                        SizedBox(height: 10,),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Text(
                              "Don't Have Account?",
                              style: TextStyle(
                                  fontSize: 15,
                              ),
                            ),
                            TextButton(
                              onPressed: (){},
                              child: Text(
                                "Contact Admin!",
                                style: TextStyle(
                                  fontSize: 15,
                                  color: Color.fromRGBO(16, 132, 139, 1),
                                ),
                              ),
                            )
                          ],
                        )
                      ],
                    )
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

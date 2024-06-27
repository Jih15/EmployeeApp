import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile_pegawai/ApiService.dart';
import 'package:mobile_pegawai/main.dart';
import 'package:mobile_pegawai/view/main/loading_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isObscured = true;
  bool _isLoading = false;
  final Api _apiService = Api();

  void loginUser() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final response = await _apiService.login(
        _emailController.text.trim(),
        _passwordController.text.trim(),
      );

      if (response['success']) {
        SharedPreferences pref = await SharedPreferences.getInstance();
        pref.setString('token', response['token']);

        // Fetch karyawan data after login
        await _apiService.getKaryawanData(response['token'], context);
      } else {
        setState(() {
          _isLoading = false;
        });

        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Login Gagal'),
            content: Text(response['message']),
            actions: <Widget>[
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('OK'),
              ),
            ],
          ),
        );
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });

      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Error'),
          content: const Text('Terjadi kesalahan jaringan. Silakan coba lagi.'),
          actions: <Widget>[
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('OK'),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Stack(
          children: [
            SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 40,),
                    Center(
                      child: Image.asset('assets/img/logo.png', scale: (1/0.45)),
                    ),
                    const SizedBox(height: 60,),
                    const Text(
                      'Login',
                      style: TextStyle(
                        fontSize: 52,
                        fontWeight: FontWeight.w700,
                        height: 0,
                      ),
                    ),
                    const Text(
                      'Welcome back!',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w300,
                        height: 0,
                      ),
                    ),
                    const SizedBox(height: 70,),
                    TextField(
                      controller: _emailController,
                      decoration: InputDecoration(
                        prefixIcon: const Icon(
                          Icons.email_outlined,
                          color: Color.fromRGBO(52, 119, 167, 1),
                        ),
                        filled: true,
                        fillColor: const Color.fromRGBO(224, 230, 234, 1),
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: BorderSide.none
                        ),
                        hintText: 'Email',
                        hintStyle: const TextStyle(
                          color: Color.fromRGBO(91, 95, 98, 1),
                          fontSize: 16,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                    const SizedBox(height: 15,),
                    TextField(
                      controller: _passwordController,
                      obscureText: _isObscured,
                      decoration: InputDecoration(
                        prefixIcon: const Icon(
                          Icons.lock_outline,
                          color: Color.fromRGBO(52, 119, 167, 1),
                        ),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _isObscured ? Icons.visibility : Icons.visibility_off,
                            color: const Color.fromRGBO(52, 119, 167, 1),
                          ),
                          onPressed: (){
                            setState(() {
                              _isObscured = !_isObscured;
                            });
                          },
                        ),
                        filled: true,
                        fillColor: const Color.fromRGBO(224, 230, 234, 1),
                        border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(10),
                            borderSide: BorderSide.none
                        ),
                        hintText: 'Password',
                        hintStyle: const TextStyle(
                          color: Color.fromRGBO(91, 95, 98, 1),
                          fontSize: 16,
                          fontWeight: FontWeight.w400,
                        ),
                      ),
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                    const SizedBox(height: 80,),
                    Center(
                        child: Column(
                          children: [
                            SizedBox(
                              width: 250,
                              height: 55,
                              child : ElevatedButton(
                                onPressed:() {
                                  loginUser();
                                },
                                style: ElevatedButton.styleFrom(
                                  shape: RoundedRectangleBorder(
                                      borderRadius:BorderRadius.circular(12)
                                  ),
                                  elevation: 4,
                                  backgroundColor: const Color.fromRGBO(32, 154, 207, 1),
                                ),
                                child: const Text(
                                  'Login',
                                  style: TextStyle(
                                      fontSize: 18,
                                      color: Colors.white,
                                      fontWeight: FontWeight.w500
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(height: 10,),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              crossAxisAlignment: CrossAxisAlignment.center,
                              children: [
                                const Text(
                                  "Don't Have Account?",
                                  style: TextStyle(
                                    fontSize: 15,
                                  ),
                                ),
                                TextButton(
                                  onPressed: (){},
                                  child: const Text(
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
            if (_isLoading)
              const LoadingScreen()
          ],
        ),
      ),
    );
  }
}

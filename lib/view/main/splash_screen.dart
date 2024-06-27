// import 'dart:convert';
//
// import 'package:flutter/material.dart';
// import 'package:mobile_pegawai/model/auth_data.dart';
// import 'package:mobile_pegawai/main.dart';
// import 'package:mobile_pegawai/view/login_page.dart';
// import 'package:shared_preferences/shared_preferences.dart';
//
// class SplashScreen extends StatefulWidget {
//   const SplashScreen({super.key});
//
//   @override
//   State<SplashScreen> createState() => _SplashScreenState();
// }
//
// class _SplashScreenState extends State<SplashScreen> {
//
//   @override
//   void initState(){
//     super.initState();
//     _checkLoginStatus();
//   }
//
//   Future<void> _checkLoginStatus() async {
//     SharedPreferences prefs = await SharedPreferences.getInstance();
//     String? token = prefs.getString('token');
//
//     if(token != null){
//       Navigator.of(context).pushReplacement(
//         MaterialPageRoute(
//           builder: (context) => KepegawaianMain(token: token,),
//         )
//       );
//     }else {
//       Navigator.of(context).pushReplacement(
//         MaterialPageRoute(
//           builder: (context) => const LoginPage(),
//         ),
//       );
//     }
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       body: Padding(
//         padding: const EdgeInsets.all(30),
//         child: Center(
//           child: Column(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               Padding(
//                 padding: const EdgeInsets.all(30),
//                 child: Image.asset(
//                   'assets/img/logo.png',
//                   scale: (1/0.5),
//                 ),
//               ),
//               const SizedBox(height: 35,),
//               const LinearProgressIndicator()
//             ],
//           ),
//         ),
//       )
//     );
//   }
// }

import 'package:flutter/material.dart';
import 'package:google_nav_bar/google_nav_bar.dart';
import 'package:mobile_pegawai/dashboard-page.dart';
import 'package:mobile_pegawai/model/evaluasi.dart';
import 'package:mobile_pegawai/model/gaji.dart';
import 'package:mobile_pegawai/model/karyawan.dart';
import 'package:mobile_pegawai/model/user.dart';
import 'package:mobile_pegawai/kepegawaian-page.dart';
import 'package:mobile_pegawai/profile-page.dart';
import 'package:mobile_pegawai/splash-screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.white),
        useMaterial3: true,
        fontFamily: 'Outfit'
      ),
      home: const SplashScreen(),
    );
  }
}

class KepegawaianMain extends StatefulWidget {

  final User user;
  final Karyawan karyawan;
  final Gaji gaji;
  final Evaluasi evaluasi;

  KepegawaianMain({
    Key? key,
    required this.user,
    required this.karyawan,
    required this.gaji,
    required this.evaluasi,
  }) : super(key: key);

  @override
  State<KepegawaianMain> createState() => _KepegawaianState();
}

class _KepegawaianState extends State<KepegawaianMain> {
  int selectedPage = 0;
  PageController _pageController = PageController();
  late List<Widget> _pages;

  @override
  void initState(){
    super.initState();
    _pages = [
      DashboardPage(
        user: widget.user,
        karyawan: widget.karyawan,
        gaji: widget.gaji,
        evaluasi: widget.evaluasi,
      ),
      KepegawaianPage(),
      ProfilePage()
    ];
  }

  void _onTap(int index){
    setState(() {
      selectedPage = index;
    });
    _pageController.jumpToPage(index);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        controller: _pageController,
        children: _pages,
        onPageChanged: (index){
          setState(() {
            selectedPage = index;
          });
        },
      ),
      bottomNavigationBar: Padding(
        padding: EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Container(
          decoration: BoxDecoration(
              color: Color.fromRGBO(24, 58, 82, 1),
              borderRadius: BorderRadius.circular(35)
          ),
          child: Padding(
            padding: EdgeInsets.symmetric(horizontal: 10, vertical: 10),
            child: GNav(
              // backgroundColor: Color.fromRGBO(24, 58, 82, 1),
              selectedIndex: selectedPage,
              color: Colors.white,
              activeColor: Colors.black,
              tabBackgroundColor: Colors.white,
              gap: 8,
              padding: EdgeInsets.all(16),
              onTabChange: _onTap,
              tabs: [
                GButton(
                  icon: Icons.home_filled,
                  text: 'Home',
                ),
                GButton(
                  icon: Icons.dataset_rounded,
                  text: 'Kepegawaian',
                ),
                GButton(
                  icon: Icons.person,
                  text: 'Profile',
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}


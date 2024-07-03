import 'package:flutter/material.dart';
import 'package:google_nav_bar/google_nav_bar.dart';
import 'package:mobile_pegawai/ApiService.dart';
import 'package:mobile_pegawai/view/main/login_page.dart';
import 'package:mobile_pegawai/view/page/dashboard_page.dart';
import 'package:mobile_pegawai/view/page/notification_page.dart';
import 'package:mobile_pegawai/view/page/profile_page.dart';
import 'package:mobile_pegawai/view/main/splash_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Kepegawaian',
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
  const KepegawaianMain({super.key});

  @override
  State<KepegawaianMain> createState() => _KepegawaianState();
}

class _KepegawaianState extends State<KepegawaianMain> {
  int selectedPage = 0;
  final PageController _pageController = PageController();
  late List<Widget> _pages = [];

  Map<String, dynamic>? dataKaryawan;

  @override
  void initState() {
    super.initState();
    getDataKaryawan();
  }

  Future<void> getDataKaryawan() async {
    try {
      Map<String, dynamic>? fetchedData = await Api().getKaryawanData(context);
      if (fetchedData != null) {
        setState(() {
          dataKaryawan = fetchedData;
          _pages = [
            DashboardPage(dataKaryawan: dataKaryawan!),
            const NotificationPage(),
            ProfilePage(dataKaryawan: dataKaryawan!),
          ];
        });
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Gagal mengambil data karyawan')),
        );
      }
    } catch (e) {
      print('Error mengambil data karyawan: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error jaringan')),
      );
    }
  }

  void _onTap(int index) {
    setState(() {
      selectedPage = index;
    });
    _pageController.jumpToPage(index);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      extendBodyBehindAppBar: true,
      backgroundColor: Colors.transparent,
      body: PageView(
        controller: _pageController,
        children: _pages,
        onPageChanged: (index) {
          setState(() {
            selectedPage = index;
          });
        },
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
        child: Container(
          decoration: BoxDecoration(
            color: const Color.fromRGBO(24, 58, 82, 1),
            borderRadius: BorderRadius.circular(35),
          ),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
            child: GNav(
              selectedIndex: selectedPage,
              color: Colors.white,
              activeColor: Colors.black,
              tabBackgroundColor: Colors.white,
              gap: 8,
              padding: const EdgeInsets.all(16),
              onTabChange: _onTap,
              tabs: const [
                GButton(
                  icon: Icons.home_filled,
                  text: 'Home',
                ),
                GButton(
                  icon: Icons.notifications_on_rounded,
                  text: 'Notifikasi',
                ),
                GButton(
                  icon: Icons.person,
                  text: 'Profil',
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

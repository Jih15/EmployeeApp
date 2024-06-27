import 'dart:async';
import 'package:flutter/material.dart';
import 'package:line_icons/line_icons.dart';
import 'package:intl/intl.dart';
import 'package:mobile_pegawai/view/page/editprofile_page.dart';
import 'package:mobile_pegawai/widget/attendance-widget.dart';
import 'package:mobile_pegawai/widget/evaluation-widget.dart';
import 'package:mobile_pegawai/widget/menu-widget.dart';

class DashboardPage extends StatefulWidget {

  final Map<String, dynamic> dataKaryawan;

  const DashboardPage({super.key, required this.dataKaryawan});

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {

  final TextEditingController _searchController = TextEditingController();
  late StreamController<DateTime> _clockController;
  late Stream<DateTime> _clock;

  @override
  void initState() {
    super.initState();
    _clockController = StreamController<DateTime>();
    _clock = _clockController.stream;
    _startClock();
  }

  void _startClock() {
    Timer.periodic(const Duration(seconds: 1), (timer) {
      _clockController.add(DateTime.now());
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        shadowColor: Colors.transparent,
        actions: [
          InkWell(
            onTap: (){
              Navigator.of(context).push(
                MaterialPageRoute(builder: (context) => EditProfile(dataKaryawan: widget.dataKaryawan)),
              );
            },
            child: CircleAvatar(
              backgroundColor: Colors.grey,
              backgroundImage: widget.dataKaryawan['foto'].isNotEmpty
                  ? NetworkImage(widget.dataKaryawan['foto'])
                  : const AssetImage('assets/img/1.jpg') as ImageProvider,
            ),
          ),
          const SizedBox(width: 15,)
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Welcome, ${widget.dataKaryawan['nama_depan']}!',
                      style: const TextStyle(
                        color: Colors.black,
                        fontSize: 28,
                        fontWeight: FontWeight.w700,
                        height: 1.2,
                      ),
                    ),
                    const Text(
                      'Check your progress',
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 15,
                        fontWeight: FontWeight.w300,
                        height: 1.2,
                      ),
                    ),
                  ],
                ),
                const Spacer(),
                StreamBuilder<DateTime>(
                  stream: _clock,
                  builder: (context, snapshot) {
                    if (snapshot.hasData) {
                      final DateTime now = snapshot.data!;
                      final String formattedDate = DateFormat('d MMM yyyy').format(now);
                      final String formattedTime = DateFormat('hh:mm a').format(now);

                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            formattedDate,
                            style: const TextStyle(
                              color: Colors.black,
                              fontSize: 20,
                              fontWeight: FontWeight.w500,
                              height: 1.2,
                            ),
                          ),
                          const SizedBox(height: 5),
                          Text(
                            formattedTime,
                            style: const TextStyle(
                              color: Colors.black,
                              fontSize: 15,
                              fontWeight: FontWeight.w300,
                              height: 1.2,
                            ),
                          ),
                        ],
                      );
                    } else {
                      return const Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Text(
                            'DD/MM/YYYY',
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: 20,
                              fontWeight: FontWeight.w500,
                              height: 1.2,
                            ),
                          ),
                          SizedBox(height: 5),
                          Text(
                            '--:--',
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: 15,
                              fontWeight: FontWeight.w300,
                              height: 1.2,
                            ),
                          ),
                        ],
                      );
                    }
                  },
                ),
              ],
            ),
            const SizedBox(height: 45),
            Container(
              width: double.infinity,
              height: 50,
              decoration: ShapeDecoration(
                color: const Color.fromRGBO(224, 230, 234, 1),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              padding: const EdgeInsets.fromLTRB(5, 0, 15, 0),
              child: TextField(
                controller: _searchController,
                decoration: const InputDecoration(
                  hintText: 'Search',
                  hintStyle: TextStyle(
                    color: Color.fromRGBO(108, 125, 137, 1),
                  ),
                  border: InputBorder.none,
                  prefixIcon: Icon(
                    LineIcons.search,
                    size: 28,
                    color: Color.fromRGBO(108, 125, 137, 1),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'ABSENSI',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 15,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 10),
            AttendanceWidget(dataKaryawan: widget.dataKaryawan),
            const SizedBox(height: 25),
            const Text(
              'MENU',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 15,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 10),
            MenuPage(dataKaryawan: widget.dataKaryawan),
            const SizedBox(height: 25),
            const Text(
              'EVALUASI TERAKHIR',
              style: TextStyle(
                color: Colors.grey,
                fontSize: 15,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 10),
            EvaluationWidget(dataKaryawan: widget.dataKaryawan),
          ],
        ),
      ),
    );
  }
}

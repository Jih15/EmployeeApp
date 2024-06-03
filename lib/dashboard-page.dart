import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:line_icons/line_icon.dart';
import 'package:mobile_pegawai/model/evaluasi.dart';
import 'package:mobile_pegawai/model/gaji.dart';
import 'package:mobile_pegawai/model/karyawan.dart';
import 'package:mobile_pegawai/model/user.dart';
import 'package:mobile_pegawai/widget/attendance-widget.dart';
import 'package:mobile_pegawai/widget/evaluation-widget.dart';
import 'package:mobile_pegawai/widget/overview-widget.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;

class DashboardPage extends StatefulWidget {
  final User user;
  final Karyawan karyawan;
  final Gaji gaji;
  final Evaluasi evaluasi;

  const DashboardPage({
    Key? key,
    required this.user,
    required this.karyawan,
    required this.gaji,
    required this.evaluasi,
  }) : super(key: key);

  @override
  State<DashboardPage> createState() => _DashboardPageState();
}

class _DashboardPageState extends State<DashboardPage> {

  Map<String, dynamic>? _karyawan;
  TextEditingController _searchController = TextEditingController();
  Stream<DateTime> _clock(){
    return Stream<DateTime>.periodic(Duration(seconds: 1), (_) => DateTime.now());
  }

  String _username = '';

  @override
  void initState() {
    super.initState();
    _loadDataUser();
    _dataKaryawanLogin();
  }

  Future<void> _dataKaryawanLogin() async{
    SharedPreferences pref = await SharedPreferences.getInstance();
    String? userID = pref.getString('user_id');

    final response = await http.get(
      Uri.parse('http://10.126.11.80:8000/api/karyawan/user/?user_id=$userID')
    );

    if (response.statusCode == 200){
      final jsonData = jsonDecode(response.body);
      setState(() {
        _karyawan = jsonData['data'];
      });
    }else{
      print('Failed to load data: ${response.statusCode}');
    }
  }

  Future<void> _loadDataUser() async{
    SharedPreferences pref = await SharedPreferences.getInstance();
    String? userDataString = pref.getString('user');
    if (userDataString != null) {
      Map<String, dynamic> userData = jsonDecode(userDataString);
      setState(() {
        _username = userData['username'] ?? 'No Username';
      });
    }else{
      setState(() {
        _username = 'No Username';
      });
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        shadowColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        actions: [
          CircleAvatar(
            backgroundColor: Colors.grey,
            backgroundImage: _karyawan != null && _karyawan!['foto'] != null
                ? NetworkImage(_karyawan!['foto'])
                : AssetImage('assets/img/1.jpg') as ImageProvider,
          ),
          SizedBox(width: 15,),
        ],
      ),
      body: SafeArea(
        child: Container(
          width: double.maxFinite,
          height: double.maxFinite,
          clipBehavior: Clip.antiAlias,
          decoration: BoxDecoration(
          ),
          child: SafeArea(
            child: SingleChildScrollView(
              child: Padding(
                padding: EdgeInsets.fromLTRB(20, 20, 20, 0),
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
                              'Welcome, $_username!',
                              style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 28,
                                  fontWeight: FontWeight.w700,
                                  height: 0
                              ),
                            ),
                            Text(
                              'Check your progress',
                              style: TextStyle(
                                color: Colors.black,
                                fontSize: 15,
                                fontWeight: FontWeight.w300,
                                height: 0,
                              ),
                            ),
                          ],
                        ),
                        Spacer(),
                        StreamBuilder<DateTime>(
                          stream: _clock(),
                          builder: (context, snapshot){
                            if (snapshot.connectionState == ConnectionState.active){
                              final DateTime now = snapshot.data!;
                              final String formattedDate = DateFormat('d MMM yyyy').format(now);
                              final String formattedTime = DateFormat('hh:mm a').format(now);

                              return Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    formattedDate,
                                    style: TextStyle(
                                        color: Colors.black,
                                        fontSize: 20,
                                        fontWeight: FontWeight.w500,
                                        height: 0
                                    ),
                                  ),
                                  SizedBox(height: 5,),
                                  Text(
                                    formattedTime,
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 15,
                                      fontWeight: FontWeight.w300,
                                      height: 0,
                                    ),
                                  ),
                                ],
                              );
                            }else {
                              return Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    'DD/MM/YYYY',
                                    style: TextStyle(
                                        color: Colors.black,
                                        fontSize: 20,
                                        fontWeight: FontWeight.w500,
                                        height: 0
                                    ),
                                  ),
                                  SizedBox(height: 5,),
                                  Text(
                                    '--:--',
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 15,
                                      fontWeight: FontWeight.w300,
                                      height: 0,
                                    ),
                                  ),
                                ],
                              );
                            }
                          },
                        ),
                      ],
                    ),
                    SizedBox(height: 45,),
                    Container(
                      width: double.maxFinite,
                      height: 50,
                      decoration: ShapeDecoration(
                        color: Color.fromRGBO(233, 233, 233, 1),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      padding: EdgeInsets.fromLTRB(5, 0, 15, 0),
                      child: TextField(
                        controller: _searchController,
                        decoration: InputDecoration(
                          hintText: 'Search',
                          hintStyle: TextStyle(
                            color: Color.fromRGBO(108, 125, 137, 1),
                          ),
                          border: InputBorder.none,
                          prefixIcon: LineIcon.search(
                            size: 28,
                            color: Color.fromRGBO(108, 125, 137, 1),
                          ),

                        ),
                      ),
                    ),
                    SizedBox(height: 12,),
                    Text(
                      'ABSENSI',
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                      ),
                    ),//
                    SizedBox(height: 10,),// Search
                    AttendanceWidget(),
                    SizedBox(height: 12,),
                    Text(
                      'REKAP ABSEN',
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    SizedBox(height: 15,),
                    OverviewEmployee(),
                    SizedBox(height: 12,),
                    Text(
                      'EVALUASI TERAKHIR',
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    SizedBox(height: 15,),
                    EvaluationWidget(evaluasi: widget.evaluasi,),
                    SizedBox(height: 12,),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

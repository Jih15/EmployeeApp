import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mobile_pegawai/ApiService.dart';

class AttendanceWidget extends StatelessWidget {

  final Map<String, dynamic> dataKaryawan;

  AttendanceWidget({Key? key, required this.dataKaryawan}) : super(key: key);

  final Api apiService = Api();

  String calculateTimeDifference() {
    DateTime now = DateTime.now();
    DateTime targetTime = DateTime(now.year, now.month, now.day, 8, 0, 0);
    Duration difference = now.difference(targetTime);

    int differenceMinutes = difference.inMinutes.abs();
    String prefix = difference.isNegative ? '-' : '+';
    String status = difference.isNegative ? 'Lebih Cepat' : 'Terlambat';

    return '$status $prefix$differenceMinutes min';
  }

  @override
  Widget build(BuildContext context) {

    String timeDifference = calculateTimeDifference();
    List<String> timeDifferenceParts = timeDifference.split(' ');

    if (timeDifferenceParts.length < 4) {
      timeDifferenceParts = ['Belum', 'Absen', ' - - - ', ''];
    }

    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        InkWell(
          onTap: () {
            apiService.checkIn(dataKaryawan['id_karyawan']).then((_) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Berhasil melakukan absen masuk!')),
              );
            }).catchError((error) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(error.toString())),
              );
            });
          },
          child: Container(
            width: 180,
            height: 140,
            padding: const EdgeInsets.all(5),
            decoration: ShapeDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF56B7FF), Color(0xFF003961)],
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(13),
              ),
            ),
            child: Padding(
              padding: const EdgeInsets.all(15),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Image.asset('assets/ico/checkinbtn.png'),
                      const SizedBox(width: 10,),
                      const Text(
                        'Absen Masuk',
                        style: TextStyle(
                          fontWeight: FontWeight.w400,
                          fontSize: 15,
                          color: Colors.white,
                        ),
                      )
                    ],
                  ),
                  const Spacer(),
                  const Text(
                    '08:00 am',
                    style: TextStyle(
                      fontSize: 27,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  Row(
                    children: [
                      Text(
                        '${timeDifferenceParts[0]} ${timeDifferenceParts[1]}',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w300,
                          color: Color.fromRGBO(255, 255, 255, 1.0),
                          height: 0,
                        ),
                      ),
                      const SizedBox(width: 3,),
                      Container(
                        height: 15,
                        decoration: ShapeDecoration(
                          color: const Color.fromRGBO(31, 189, 123, 1),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(3),
                          ),
                        ),
                        child: Center(
                          child: Text(
                            '${timeDifferenceParts[2]} ${timeDifferenceParts[3]}',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      )
                    ],
                  )
                ],
              ),
            ),
          ),
        ),
        const Spacer(),
        InkWell(
          onTap: () {
            apiService.checkOut(dataKaryawan['id_absen']).then((_) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Berhasil melakukan absen keluar!')),
              );
            }).catchError((error) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text(error.toString())),
              );
            });
          },
          child: Container(
            width: 180,
            height: 140,
            padding: const EdgeInsets.all(5),
            decoration: ShapeDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFFFF2727), Color(0xFF520000)],
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(13),
              ),
            ),
            child: Padding(
              padding: const EdgeInsets.all(15),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Image.asset('assets/ico/checkoutbtn.png'),
                      const SizedBox(width: 10,),
                      const Text(
                        'Absen Keluar',
                        style: TextStyle(
                          fontWeight: FontWeight.w400,
                          fontSize: 15,
                          color: Colors.white,
                        ),
                      )
                    ],
                  ),
                  const Spacer(),
                  const Text(
                    '05:00 pm',
                    style: TextStyle(
                      fontSize: 27,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  const Row(
                    children: [
                      Text(
                        'Lebih Cepat',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w300,
                          color: Color.fromRGBO(255, 255, 255, 1.0),
                          height: 0,
                        ),
                      ),
                      SizedBox(width: 3,),
                    ],
                  )
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}

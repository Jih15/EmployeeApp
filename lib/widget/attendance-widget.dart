import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile_pegawai/ApiService.dart';
import 'package:mobile_pegawai/model/absensi.dart';

class AttendanceWidget extends StatefulWidget {
  AttendanceWidget({Key? key}) : super(key: key);

  @override
  _AttendanceWidgetState createState() => _AttendanceWidgetState();
}

class _AttendanceWidgetState extends State<AttendanceWidget> {
  String checkInTime = '--:--';
  String checkOutTime = '--:--';
  String checkInStatus = 'Belum Absen';
  String checkOutStatus = 'Belum Absen';

  @override
  void initState() {
    super.initState();
    _updateCheckInTime();
    _updateCheckOutTime();
  }

  Future<void> _updateCheckInTime() async {
    bool hasCheckedIn = await Api().hasCheckedInToday();
    if (hasCheckedIn) {
      String latestCheckInTime = await _getLatestCheckInTime();
      setState(() {
        checkInTime = latestCheckInTime;
        checkInStatus = 'Sudah Absen';
      });
    } else {
      setState(() {
        checkInTime = '--:--';
        checkInStatus = 'Belum Absen';
      });
    }
  }

  Future<void> _updateCheckOutTime() async {
    bool hasCheckedOut = await Api().hasCheckedOutToday();
    if (hasCheckedOut) {
      String latestCheckOutTime = await _getLatestCheckOutTime();
      setState(() {
        checkOutTime = latestCheckOutTime;
        checkOutStatus = 'Sudah Absen';
      });
    } else {
      setState(() {
        checkOutTime = '--:--';
        checkOutStatus = 'Belum Absen';
      });
    }
  }

  Future<String> _getLatestCheckInTime() async {
    try {
      List<Absensi> latestRecords = await Api().getAbsenData();
      DateTime today = DateTime.now();

      for (var record in latestRecords) {
        if (record.jamMasuk != null &&
            record.jamMasuk!.year == today.year &&
            record.jamMasuk!.month == today.month &&
            record.jamMasuk!.day == today.day) {
          return DateFormat('hh:mm a').format(record.jamMasuk!);
        }
      }
      return '--:--';
    } catch (e) {
      print('Error fetching latest check-in time: $e');
      return '--:--';
    }
  }

  Future<String> _getLatestCheckOutTime() async {
    try {
      List<Absensi> latestRecords = await Api().getAbsenData();
      DateTime today = DateTime.now();

      for (var record in latestRecords) {
        if (record.jamKeluar != null &&
            record.jamKeluar!.year == today.year &&
            record.jamKeluar!.month == today.month &&
            record.jamKeluar!.day == today.day) {
          return DateFormat('hh:mm a').format(record.jamKeluar!);
        }
      }
      return '--:--';
    } catch (e) {
      print('Error fetching latest check-out time: $e');
      return '--:--';
    }
  }

  void _handleCheckIn(AbsenStatus status) async {
    try {
      await Api().checkIn();

      String formattedTime = await _getLatestCheckInTime();

      setState(() {
        checkInTime = formattedTime;
        checkInStatus = 'Sudah Absen';
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Check-in berhasil pada $formattedTime'),
          duration: Duration(seconds: 2),
        ),
      );
    } catch (e) {
      String errorMessage = 'Error: $e';
      if (e is Exception) {
        errorMessage = e.toString();
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: $errorMessage'),
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  void _handleCheckOut(AbsenStatus status) async {
    try {
      DateTime now = DateTime.now();
      if (now.hour < 10) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Check-out hanya dapat dilakukan setelah jam 03:00 PM'),
            duration: Duration(seconds: 2),
          ),
        );
        return;
      }

      await Api().checkOut();

      String formattedTime = await _getLatestCheckOutTime();

      setState(() {
        checkOutTime = formattedTime;
        checkOutStatus = 'Sudah Absen';
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Check-out berhasil pada $formattedTime'),
          duration: Duration(seconds: 2),
        ),
      );
    } catch (e) {
      String errorMessage = 'Error: $e';
      if (e is Exception) {
        errorMessage = e.toString();
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: $errorMessage'),
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  void _showCheckInDialog(BuildContext context) {
    _handleCheckIn(AbsenStatus.hadir);
  }

  void _showCheckOutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Pilih Status Absen'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              ListTile(
                title: Text('Hadir'),
                onTap: () {
                  Navigator.of(context).pop(AbsenStatus.hadir);
                },
              ),
              ListTile(
                title: Text('Izin'),
                onTap: () {
                  Navigator.of(context).pop(AbsenStatus.izin);
                },
              ),
            ],
          ),
        );
      },
    ).then((selectedStatus) {
      if (selectedStatus != null) {
        _handleCheckOut(selectedStatus);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        // CheckIn
        GestureDetector(
          onTap: () {
            _handleCheckIn(AbsenStatus.hadir);
          },
          onLongPress: () {
            _showCheckInDialog(context);
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
                  Text(
                    checkInTime,
                    style: const TextStyle(
                      fontSize: 27,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  Row(
                    children: [
                      Text(
                        'Status',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w300,
                          color: Colors.white,
                          height: 0,
                        ),
                      ),
                      const SizedBox(width: 3,),
                      Container(
                        padding: EdgeInsets.symmetric(vertical: 2, horizontal: 1),
                        height: 15,
                        decoration: ShapeDecoration(
                          color: const Color.fromRGBO(31, 189, 123, 1),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(3),
                          ),
                        ),
                        child: Center(
                          child: Text(
                            checkInStatus,
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
        // CheckOut
        GestureDetector(
          onTap: () {
            _handleCheckOut(AbsenStatus.hadir);
          },
          onLongPress: () {
            _showCheckOutDialog(context);
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
                  Text(
                    checkOutTime,
                    style: const TextStyle(
                      fontSize: 27,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  Row(
                    children: [
                      Text(
                        'Status',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w300,
                          color: Colors.white,
                          height: 0,
                        ),
                      ),
                      const SizedBox(width: 3,),
                      Container(
                        padding: EdgeInsets.symmetric(vertical: 2, horizontal: 1),
                        height: 15,
                        decoration: ShapeDecoration(
                          color: const Color.fromRGBO(31, 189, 123, 1),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(3),
                          ),
                        ),
                        child: Center(
                          child: Text(
                            checkOutStatus,
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
      ],
    );
  }
}

enum AbsenStatus {
  hadir,
  izin,
}

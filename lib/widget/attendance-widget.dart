import 'package:flutter/material.dart';

class AttendanceWidget extends StatelessWidget {
  const AttendanceWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Container(
          width: 180,
          height: 140,
          padding: EdgeInsets.all(5),
          decoration: ShapeDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Color(0xFF56B7FF), Color(0xFF003961)],
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(13),
            ),
          ),
          child: Padding(
            padding: EdgeInsets.all(15),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Image.asset('assets/ico/checkinbtn.png'),
                    SizedBox(width: 10,),
                    Text(
                      'Absen Masuk',
                      style: TextStyle(
                        fontWeight: FontWeight.w400,
                        fontSize: 15,
                        color: Colors.white
                      ),
                    )
                  ],
                ),
                Spacer(),
                Text(
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
                      'Lebih Cepat',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w300,
                        color: Color.fromRGBO(255, 255, 255, 1.0),
                        height: 0,
                      ),
                    ),
                    SizedBox(width: 3,),
                    Container(
                      width: 35,
                      height: 15,
                      decoration: ShapeDecoration(
                        color: Color.fromRGBO(31, 189, 123, 1),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(3)
                        ),
                      ),
                      child: Center(
                        child: Text(
                          '+4 min',
                          style: TextStyle(
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
        Spacer(),
        Container(
          width: 180,
          height: 140,
          padding: EdgeInsets.all(5),
          decoration: ShapeDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Color(0xFFFF2727), Color(0xFF520000)],
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(13),
            ),
          ),
          child: Padding(
            padding: EdgeInsets.all(15),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Image.asset('assets/ico/checkoutbtn.png'),
                    SizedBox(width: 10,),
                    Text(
                      'Absen Keluar',
                      style: TextStyle(
                          fontWeight: FontWeight.w400,
                          fontSize: 15,
                          color: Colors.white
                      ),
                    )
                  ],
                ),
                Spacer(),
                Text(
                  '05:00 pm',
                  style: TextStyle(
                    fontSize: 27,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
                Row(
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
                    // Container(
                    //   width: 35,
                    //   height: 15,
                    //   decoration: ShapeDecoration(
                    //     color: Color.fromRGBO(31, 189, 123, 1),
                    //     shape: RoundedRectangleBorder(
                    //         borderRadius: BorderRadius.circular(3)
                    //     ),
                    //   ),
                    //   child: Center(
                    //     child: Text(
                    //       '+4 min',
                    //       style: TextStyle(
                    //         color: Colors.white,
                    //         fontSize: 10,
                    //         fontWeight: FontWeight.w600,
                    //       ),
                    //     ),
                    //   ),
                    // )
                  ],
                )
              ],
            ),
          ),
        ),
      ],
    );
  }
}

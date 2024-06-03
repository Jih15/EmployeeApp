import 'dart:ui';

import 'package:flutter/material.dart';

class OverviewEmployee extends StatelessWidget {
  const OverviewEmployee({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: double.maxFinite,
        height: 110,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: Color.fromRGBO(207, 207, 207, 1),
          )
        ),
        child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  width: 90,
                  height: double.maxFinite,
                  child: Column(
                    children: [
                      Text(
                        'Izin',
                        style: TextStyle(
                          fontSize: 18,
                        ),
                      ),
                      Text(
                        '02',
                        style: TextStyle(
                            fontSize: 25,
                            fontWeight: FontWeight.w700
                        ),
                      )
                    ],
                  ),
                ),
                Spacer(),
                VerticalDivider(
                  thickness: 1.5,
                  color: Colors.black,
                ),
                Spacer(),
                Container(
                  width: 90,
                  height: double.maxFinite,
                  child: Column(
                    children: [
                      Text(
                        'Terlambat',
                        style: TextStyle(
                          fontSize: 18,
                        ),
                      ),
                      Text(
                        '15',
                        style: TextStyle(
                          fontSize: 25,
                          fontWeight: FontWeight.w700,
                        ),
                      )
                    ],
                  ),
                ),
                Spacer(),
                VerticalDivider(
                  thickness: 1.5,
                  color: Colors.black,
                ),
                Spacer(),
                Container(
                  width: 90,
                  height: double.maxFinite,
                  child: Column(
                    children: [
                      Text(
                        'Hadir',
                        style: TextStyle(
                          fontSize: 18,
                        ),
                      ),
                      Text(
                        '31',
                        style: TextStyle(
                            fontSize: 25,
                            fontWeight: FontWeight.w700
                        ),
                      )
                    ],
                  ),
                ),
                Spacer(),
              ],
            )
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class GajiMenu extends StatefulWidget {
  final Map<String, dynamic> dataGajiKaryawan;

  const GajiMenu({Key? key, required this.dataGajiKaryawan}) : super(key: key);

  @override
  State<GajiMenu> createState() => _GajiMenuState();
}

class _GajiMenuState extends State<GajiMenu> {
  final currencyFormat = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp');

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Periode Gaji'),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: ListView.builder(
          itemCount: widget.dataGajiKaryawan['gaji'].length,
          itemBuilder: (context, index) {
            final gaji = widget.dataGajiKaryawan['gaji'][index];
            final int totalGaji = gaji['total_gaji'];
            final int gajiPokok = gaji['gaji_pokok'];
            final int tunjangan = gaji['tunjangan'];
            final int bonus = gaji['bonus'];
            final int potongan = gaji['potongan'];

            return Card(
              color: const Color.fromRGBO(255, 255, 255, 1),
              elevation: 4,
              child: Theme(
                data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
                child: ExpansionTile(
                  iconColor: Colors.black,
                  collapsedIconColor: Colors.black,
                  childrenPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
                  expandedCrossAxisAlignment: CrossAxisAlignment.end,
                  title: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(_formatDate(gaji['tanggal_penggajian'])),
                      Text('Total Gaji: ${currencyFormat.format(totalGaji)}'),
                    ],
                  ),
                  children: [
                    Row(
                      children: [
                        Text('Gaji Pokok:'),
                        Spacer(),
                        Text(currencyFormat.format(gajiPokok))
                      ],
                    ),
                    Row(
                      children: [
                        Text('Tunjangan:'),
                        Spacer(),
                        Text(currencyFormat.format(tunjangan))
                      ],
                    ),
                    Row(
                      children: [
                        Text('Bonus:'),
                        Spacer(),
                        Text(currencyFormat.format(bonus))
                      ],
                    ),
                    Row(
                      children: [
                        Text('Potongan:'),
                        Spacer(),
                        Text(currencyFormat.format(potongan))
                      ],
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  String _formatDate(String dateString) {
    DateTime dateTime = DateTime.parse(dateString);
    return '${_getMonthName(dateTime.month)} ${dateTime.year}';
  }

  String _getMonthName(int month) {
    switch (month) {
      case 1:
        return 'Januari';
      case 2:
        return 'Februari';
      case 3:
        return 'Maret';
      case 4:
        return 'April';
      case 5:
        return 'Mei';
      case 6:
        return 'Juni';
      case 7:
        return 'Juli';
      case 8:
        return 'Agustus';
      case 9:
        return 'September';
      case 10:
        return 'Oktober';
      case 11:
        return 'November';
      case 12:
        return 'Desember';
      default:
        return '';
    }
  }
}

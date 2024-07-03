import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile_pegawai/ApiService.dart';
import 'package:mobile_pegawai/model/gaji.dart';

class GajiMenu extends StatefulWidget {
  @override
  _GajiMenuState createState() => _GajiMenuState();
}

class _GajiMenuState extends State<GajiMenu> {
  final currencyFormat = NumberFormat.currency(locale: 'id_ID', symbol: 'Rp');
  late Future<List<Gaji>> _gajiFuture;

  @override
  void initState() {
    super.initState();
    _loadGajiData();
  }

  Future<void> _loadGajiData() async {
    try {
      _gajiFuture = Api().getGajiData(context);
    } catch (e) {
      print('Error fetching gaji data: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Failed to fetch gaji data')),
      );
    }
  }

  String _formatDate(DateTime date) {
    return DateFormat('dd MMM yyyy').format(date);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Periode Gaji'),
        centerTitle: true,
      ),
      body: FutureBuilder<List<Gaji>>(
        future: _gajiFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return Center(child: Text('Data gaji kosong'));
          } else {
            List<Gaji> gajiList = snapshot.data!;
            return Padding(
              padding: const EdgeInsets.all(20),
              child: ListView.builder(
                itemCount: gajiList.length,
                itemBuilder: (context, index) {
                  final gaji = gajiList[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(10),
                        color: Colors.white,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.5),
                            spreadRadius: 1,
                            blurRadius: 4,
                            offset: Offset(0, 3), // changes position of shadow
                          ),
                        ],
                      ),
                      child: ExpansionTile(
                        backgroundColor: Colors.transparent,
                        tilePadding: EdgeInsets.zero,
                        expandedCrossAxisAlignment: CrossAxisAlignment.end,
                        title: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _formatDate(gaji.tanggalPenggajian),
                                style: TextStyle(fontWeight: FontWeight.bold),
                              ),
                              SizedBox(height: 5),
                              Text(
                                'Total Gaji: ${currencyFormat.format(gaji.totalGaji)}',
                                style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green),
                              ),
                            ],
                          ),
                        ),
                        childrenPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
                        children: [
                          SizedBox(height: 10),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Gaji Pokok:'),
                              Text(currencyFormat.format(gaji.gajiPokok)),
                            ],
                          ),
                          SizedBox(height: 5),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Tunjangan:'),
                              Text(currencyFormat.format(gaji.tunjangan)),
                            ],
                          ),
                          SizedBox(height: 5),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Bonus:'),
                              Text(currencyFormat.format(gaji.bonus)),
                            ],
                          ),
                          SizedBox(height: 5),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Potongan:'),
                              Text(currencyFormat.format(gaji.potongan)),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            );
          }
        },
      ),
    );
  }
}

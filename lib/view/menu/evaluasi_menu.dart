import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // Import paket intl untuk format tanggal
import 'package:mobile_pegawai/ApiService.dart';
import 'package:mobile_pegawai/model/evaluasi.dart';
import 'package:mobile_pegawai/widget/evaluationchart-widget.dart';

class EvaluationMenu extends StatefulWidget {
  const EvaluationMenu({Key? key}) : super(key: key);

  @override
  State<EvaluationMenu> createState() => _EvaluationMenuState();
}

class _EvaluationMenuState extends State<EvaluationMenu> {
  List<Evaluasi> evaluasiList = [];
  String currentSortOption = 'URUTKAN';
  bool isLoading = true;
  String? namaKaryawan;
  String? posisi;

  @override
  void initState() {
    super.initState();
    _fetchEvaluasiData();
  }

  Future<void> _fetchEvaluasiData() async {
    final Map<String, dynamic>? karyawanData = await Api().getKaryawanData(context);

    try {
      List<Evaluasi> data = await Api().getEvaluasiData();
      setState(() {
        evaluasiList = data;
        isLoading = false;
        namaKaryawan = karyawanData?['nama_depan'];
        posisi = karyawanData?['posisi']['nama_posisi'];
      });
    } catch (e) {
      print('Error fetching evaluasi data: $e');
      setState(() {
        isLoading = false;
      });
    }
  }

  void sortEvaluasi() {
    setState(() {
      switch (currentSortOption) {
        case 'TERBARU':
          evaluasiList.sort((a, b) => b.tahunEvaluasi.compareTo(a.tahunEvaluasi));
          break;
        case 'TERLAMA':
          evaluasiList.sort((a, b) => a.tahunEvaluasi.compareTo(b.tahunEvaluasi));
          break;
        case 'TERTINGGI':
          evaluasiList.sort((a, b) => b.penilaianKinerja.compareTo(a.penilaianKinerja));
          break;
        case 'TERENDAH':
          evaluasiList.sort((a, b) => a.penilaianKinerja.compareTo(b.penilaianKinerja));
          break;
        default:
          break;
      }
    });
  }

  double _calculateAverageRating() {
    if (evaluasiList.isEmpty) return 0.0;

    double totalRating = 0;
    for (var evaluasi in evaluasiList) {
      totalRating += evaluasi.penilaianKinerja.toDouble();
    }

    return totalRating / evaluasiList.length;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Evaluasi'),
        centerTitle: true,
      ),
      body: SafeArea(
        child: isLoading
            ? Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          namaKaryawan ?? 'Nama Karyawan',
                          style: const TextStyle(
                            color: Colors.black,
                            fontSize: 25,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        Text(
                          posisi ?? 'Posisi Karyawan',
                          style: const TextStyle(
                            color: Colors.black,
                            fontSize: 15,
                            fontWeight: FontWeight.w300,
                          ),
                        ),
                      ],
                    ),
                    const Spacer(),
                    Container(
                      width: 70,
                      height: 70,
                      decoration: BoxDecoration(
                        color: const Color.fromRGBO(224, 230, 234, 1),
                        borderRadius: BorderRadius.circular(15),
                      ),
                      child: Center(
                        child: Text(
                          _calculateAverageRating().toStringAsFixed(1),
                          style: const TextStyle(
                            color: Colors.black,
                            fontSize: 25,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 25),
                // const Text(
                //   'PROGRESS',
                //   style: TextStyle(
                //     color: Colors.grey,
                //     fontSize: 15,
                //     fontWeight: FontWeight.w700,
                //   ),
                // ),
                // const SizedBox(height: 10),
                // Container(
                //   height: 350,
                //   clipBehavior: Clip.antiAlias,
                //   decoration: BoxDecoration(
                //     color: const Color.fromRGBO(224, 230, 234, 1),
                //     borderRadius: BorderRadius.circular(20),
                //   ),
                //   child: Padding(
                //     padding: const EdgeInsets.all(15),
                //     child: EvaluasiChart(),
                //   ),
                // ),
                // Sorting button
                Row(
                  children: [
                    const Text(
                      'REKAP PENILAIAN',
                      style: TextStyle(
                        color: Colors.grey,
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const Spacer(),
                    TextButton.icon(
                      onPressed: () {
                        setState(() {
                          switch (currentSortOption) {
                            case 'URUTKAN':
                              currentSortOption = 'TERBARU';
                              sortEvaluasi();
                              break;
                            case 'TERBARU':
                              currentSortOption = 'TERLAMA';
                              sortEvaluasi();
                              break;
                            case 'TERLAMA':
                              currentSortOption = 'TERTINGGI';
                              sortEvaluasi();
                              break;
                            case 'TERTINGGI':
                              currentSortOption = 'TERENDAH';
                              sortEvaluasi();
                              break;
                            case 'TERENDAH':
                              currentSortOption = 'URUTKAN';
                              sortEvaluasi();
                              break;
                            default:
                              currentSortOption = 'URUTKAN';
                              sortEvaluasi();
                              break;
                          }
                        });
                      },
                      icon: Icon(Icons.sort),
                      label: Text(currentSortOption),
                    ),
                  ],
                ),
                // List of sorted evaluations
                SizedBox(
                  height: double.maxFinite,
                  child: ListView.builder(
                    padding: EdgeInsets.symmetric(horizontal: 4),
                    itemCount: evaluasiList.length,
                    itemBuilder: (context, index) {
                      final evaluasi = evaluasiList[index];
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 5),
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(10),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.grey.withOpacity(0.5),
                                spreadRadius: 2,
                                blurRadius: 5,
                                offset: const Offset(0, 3),
                              ),
                            ],
                          ),
                          child: ListTile(
                            title: Text(
                              DateFormat('dd MMM yyyy').format(evaluasi.tahunEvaluasi),
                              style: const TextStyle(
                                color: Colors.black,
                                fontSize: 18,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            subtitle: Text(
                              evaluasi.catatan,
                              style: const TextStyle(color: Colors.grey),
                            ),
                            trailing: Text(
                              evaluasi.penilaianKinerja.toString(),
                              style: const TextStyle(
                                color: Colors.black,
                                fontSize: 18,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

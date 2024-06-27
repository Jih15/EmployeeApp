import 'package:flutter/material.dart';

class EvaluationMenu extends StatefulWidget {
  final Map<String, dynamic> dataKaryawan;

  const EvaluationMenu({Key? key, required this.dataKaryawan}) : super(key: key);

  @override
  State<EvaluationMenu> createState() => _EvaluationMenuState();
}

class _EvaluationMenuState extends State<EvaluationMenu> {
  late List<dynamic> evaluasiList;
  String currentSortOption = 'URUTKAN';

  @override
  void initState() {
    super.initState();
    evaluasiList = List.from(widget.dataKaryawan['evaluasi']);
  }

  void sortEvaluasi() {
    setState(() {
      switch (currentSortOption) {
        case 'TERBARU':
          evaluasiList.sort((a, b) => b['tahun_evaluasi'].compareTo(a['tahun_evaluasi']));
          break;
        case 'TERLAMA':
          evaluasiList.sort((a, b) => a['tahun_evaluasi'].compareTo(b['tahun_evaluasi']));
          break;
        case 'TERTINGGI':
          evaluasiList.sort((a, b) => double.parse(b['penilaian_kinerja']).compareTo(double.parse(a['penilaian_kinerja'])));
          break;
        case 'TERENDAH':
          evaluasiList.sort((a, b) => double.parse(a['penilaian_kinerja']).compareTo(double.parse(b['penilaian_kinerja'])));
          break;
        default:
          evaluasiList = List.from(widget.dataKaryawan['evaluasi']);
          currentSortOption = 'URUTKAN';
          break;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Evaluasi'),
        centerTitle: true,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
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
                          '${widget.dataKaryawan['nama_depan']} ${widget.dataKaryawan['nama_belakang']}',
                          style: const TextStyle(
                            color: Colors.black,
                            fontSize: 25,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        Text(
                          widget.dataKaryawan['posisi']['nama_posisi'],
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
                const Text(
                  'PROGRESS',
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 10),
                Container(
                  height: 350,
                  decoration: BoxDecoration(
                      color: const Color.fromRGBO(224, 230, 234, 1),
                      borderRadius: BorderRadius.circular(20)
                  ),
                  child: const Padding(
                    padding: EdgeInsets.all(15),
                    child: null,
                  ),
                ),
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
                  height: 310,
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
                              evaluasi['tahun_evaluasi'],
                              style: const TextStyle(
                                color: Colors.black,
                                fontSize: 18,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            subtitle: Text(
                              evaluasi['catatan'],
                              style: const TextStyle(color: Colors.grey),
                            ),
                            trailing: Text(
                              evaluasi['penilaian_kinerja'],
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

  double _calculateAverageRating() {
    if (evaluasiList.isEmpty) return 0.0;

    double totalRating = 0;
    for (var evaluasi in evaluasiList) {
      totalRating += double.parse(evaluasi['penilaian_kinerja']);
    }

    return totalRating / evaluasiList.length;
  }
}

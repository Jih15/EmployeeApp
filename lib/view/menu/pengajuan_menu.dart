import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile_pegawai/ApiService.dart';

class PengajuanMenu extends StatelessWidget {
  const PengajuanMenu({Key? key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      initialIndex: 1,
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Halaman Pengajuan'),
          centerTitle: true,
          bottom: const TabBar(
            tabs: <Widget>[
              Tab(
                child: Text('Cuti'),
              ),
              Tab(
                child: Text('Pelatihan'),
              ),
            ],
          ),
        ),
        body: const TabBarView(
          children: <Widget>[
            PengajuanCuti(),
            PengajuanPelatihan(),
          ],
        ),
      ),
    );
  }
}

class PengajuanCuti extends StatefulWidget {
  const PengajuanCuti({Key? key});

  @override
  State<PengajuanCuti> createState() => _PengajuanCutiState();
}

class _PengajuanCutiState extends State<PengajuanCuti> {
  final TextEditingController _tanggalMulaiController = TextEditingController();
  final TextEditingController _tanggalSelesaiController = TextEditingController();
  final TextEditingController _keteranganCutiController = TextEditingController();

  Future<void> _selectDate(BuildContext context, TextEditingController controller) async {
    DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime(2100),
    );

    if (pickedDate != null) {
      setState(() {
        controller.text = DateFormat('yyyy-MM-dd').format(pickedDate);
      });
    }
  }

  Future<void> _ajukanCuti() async {
    try {
      DateTime tanggalMulai = DateFormat('yyyy-MM-dd').parse(_tanggalMulaiController.text);
      DateTime tanggalSelesai = DateFormat('yyyy-MM-dd').parse(_tanggalSelesaiController.text);
      String keterangan = _keteranganCutiController.text;
      await Api().pengajuanCuti(tanggalMulai, tanggalSelesai, keterangan);

      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Pengajuan cuti berhasil diajukan'),
        duration: Duration(seconds: 2),
      ));

      _tanggalMulaiController.clear();
      _tanggalSelesaiController.clear();
      _keteranganCutiController.clear();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Gagal mengajukan cuti: $e'),
        duration: Duration(seconds: 2),
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Isi Data Pengajuan Cuti',
                  style: TextStyle(
                    fontSize: 18,
                  ),
                ),
                SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: _buildTextFormField(
                        controller: _tanggalMulaiController,
                        hintText: 'Tanggal Mulai',
                        textInputType: TextInputType.text,
                        onTap: () => _selectDate(context, _tanggalMulaiController),
                        readOnly: false, // Ubah menjadi false agar bisa diisi
                      ),
                    ),
                    SizedBox(width: 15),
                    Expanded(
                      child: _buildTextFormField(
                        controller: _tanggalSelesaiController,
                        hintText: 'Tanggal Selesai',
                        textInputType: TextInputType.text,
                        onTap: () => _selectDate(context, _tanggalSelesaiController),
                        readOnly: false, // Ubah menjadi false agar bisa diisi
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 15),
                _buildTextFormField(
                  controller: _keteranganCutiController,
                  hintText: 'Keterangan Cuti',
                  textInputType: TextInputType.text,
                  readOnly: false, // Ubah menjadi false agar bisa diisi
                ),
                SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _ajukanCuti, // Panggil fungsi pengajuan cuti di sini
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color.fromRGBO(24, 58, 82, 1),
                    minimumSize: Size(double.infinity, 50),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: Text(
                    'Ajukan',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextFormField({
    required TextEditingController controller,
    required String hintText,
    required TextInputType textInputType,
    VoidCallback? onTap,
    bool readOnly = true,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: textInputType,
      readOnly: readOnly,
      onTap: onTap,
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: TextStyle(
          color: Color.fromRGBO(108, 125, 137, 1),
          fontWeight: FontWeight.w400,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(10)),
        ),
        suffixIcon: onTap != null ? Icon(Icons.calendar_today) : null,
      ),
      validator: (value) {
        if (value == null || value.isEmpty) {
          return '$hintText harus diisi';
        }
        return null;
      },
    );
  }
}

class PengajuanPelatihan extends StatefulWidget {
  const PengajuanPelatihan({Key? key});

  @override
  State<PengajuanPelatihan> createState() => _PengajuanPelatihanState();
}

class _PengajuanPelatihanState extends State<PengajuanPelatihan> {
  final TextEditingController _namaPelatihanController = TextEditingController();
  final TextEditingController _tanggalPelatihanController = TextEditingController();
  final TextEditingController _lokasiPelatihanController = TextEditingController();
  final TextEditingController _lamaPelatihanController = TextEditingController();

  Future<void> _selectDate(BuildContext context, TextEditingController controller) async {
    DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime(2100),
    );

    if (pickedDate != null) {
      setState(() {
        controller.text = DateFormat('yyyy-MM-dd').format(pickedDate);
      });
    }
  }

  Future<void> _ajukanPelatihan() async {
    try {
      String namaPelatihan = _namaPelatihanController.text;
      DateTime tanggalPelatihan = DateFormat('yyyy-MM-dd').parse(_tanggalPelatihanController.text);
      String lokasiPelatihan = _lokasiPelatihanController.text;
      int lamaPelatihan = int.tryParse(_lamaPelatihanController.text) ?? 0;

      await Api().pengajuanPelatihan(namaPelatihan, tanggalPelatihan, lokasiPelatihan, lamaPelatihan);

      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Pengajuan pelatihan berhasil diajukan'),
        duration: Duration(seconds: 2),
      ));

      _namaPelatihanController.clear();
      _tanggalPelatihanController.clear();
      _lokasiPelatihanController.clear();
      _lamaPelatihanController.clear();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('Gagal mengajukan pelatihan: $e'),
        duration: Duration(seconds: 2),
      ));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Isi Data Pengajuan Pelatihan',
                  style: TextStyle(
                    fontSize: 18,
                  ),
                ),
                SizedBox(height: 20),
                _buildTextFormField(
                  controller: _namaPelatihanController,
                  hintText: 'Nama Pelatihan',
                  textInputType: TextInputType.text,
                  readOnly: false, // Ubah menjadi false agar bisa diisi
                ),
                SizedBox(height: 15),
                _buildTextFormField(
                  controller: _tanggalPelatihanController,
                  hintText: 'Tanggal Pelatihan',
                  textInputType: TextInputType.text,
                  onTap: () => _selectDate(context, _tanggalPelatihanController),
                  readOnly: false, // Ubah menjadi false agar bisa diisi
                ),
                SizedBox(height: 15),
                _buildTextFormField(
                  controller: _lokasiPelatihanController,
                  hintText: 'Lokasi Pelatihan',
                  textInputType: TextInputType.text,
                  readOnly: false, // Ubah menjadi false agar bisa diisi
                ),
                SizedBox(height: 15),
                _buildTextFormField(
                  controller: _lamaPelatihanController,
                  hintText: 'Lama Pelatihan (hari)',
                  textInputType: TextInputType.number,
                  readOnly: false, // Ubah menjadi false agar bisa diisi
                ),
                SizedBox(height: 20),
                ElevatedButton(
                  onPressed: _ajukanPelatihan, // Panggil fungsi pengajuan pelatihan di sini
                  style: ElevatedButton.styleFrom(
                    minimumSize: Size(double.infinity, 50),
                    backgroundColor: Color.fromRGBO(24, 58, 82, 1),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: Text(
                    'Ajukan',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.white,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextFormField({
    required TextEditingController controller,
    required String hintText,
    required TextInputType textInputType,
    VoidCallback? onTap,
    bool readOnly = true,
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: textInputType,
      readOnly: readOnly,
      onTap: onTap,
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: TextStyle(
          color: Color.fromRGBO(108, 125, 137, 1),
          fontWeight: FontWeight.w400,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(10)),
        ),
        suffixIcon: onTap != null ? Icon(Icons.calendar_today) : null,
      ),
      validator: (value) {
        if (value == null || value.isEmpty) {
          return '$hintText harus diisi';
        }
        return null;
      },
    );
  }
}

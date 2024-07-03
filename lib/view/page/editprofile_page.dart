import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mobile_pegawai/ApiService.dart';

class EditKaryawan extends StatefulWidget {
  final Map<String, dynamic> dataKaryawan;

  const EditKaryawan({super.key, required this.dataKaryawan});

  @override
  State<EditKaryawan> createState() => _EditKaryawanState();
}

class _EditKaryawanState extends State<EditKaryawan> {
  String? _selectedGender;
  final _formKey = GlobalKey<FormState>();
  final Api _apiService = Api();

  final TextEditingController _namaDepanController = TextEditingController();
  final TextEditingController _namaBelakangController = TextEditingController();
  final TextEditingController _tanggalLahirController = TextEditingController();
  final TextEditingController _alamatController = TextEditingController();
  final TextEditingController _noTelpController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _tanggalMasukController = TextEditingController();
  final TextEditingController _fotoController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _namaDepanController.text = widget.dataKaryawan['nama_depan'] ?? '';
    _namaBelakangController.text = widget.dataKaryawan['nama_belakang'] ?? '';
    _tanggalLahirController.text = widget.dataKaryawan['tgl_lahir'] ?? '';
    _alamatController.text = widget.dataKaryawan['alamat'] ?? '';
    _noTelpController.text = widget.dataKaryawan['no_telp'] ?? '';
    _emailController.text = widget.dataKaryawan['email'] ?? '';
    _tanggalMasukController.text = widget.dataKaryawan['tgl_masuk'] ?? '';
    _fotoController.text = widget.dataKaryawan['foto'] ?? '';
    _selectedGender = widget.dataKaryawan['jenis_kelamin'];
  }

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

  void editKaryawan() async {
    if (_formKey.currentState!.validate()) {
      bool confirm = await showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: Text('Konfirmasi'),
          content: Text('Anda yakin ingin menyimpan perubahan?'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(false),
              child: Text(
                'Batal',
                style: TextStyle(
                  color: Colors.red
                ),
              ),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Color.fromRGBO(24, 58, 82, 1)
              ),
              onPressed: () => Navigator.of(context).pop(true),
              child: Text(
                'Simpan',
                style: TextStyle(
                  color: Colors.white
                ),
              ),
            ),
          ],
        ),
      );

      if (confirm ?? false) {
        try {
          final DateTime tglLahir = DateFormat('yyyy-MM-dd').parse(_tanggalLahirController.text);
          final DateTime tglMasuk = DateFormat('yyyy-MM-dd').parse(_tanggalMasukController.text);

          await _apiService.updateDataKaryawan(
            _namaDepanController.text,
            _namaBelakangController.text,
            _selectedGender!,
            tglLahir,
            _alamatController.text,
            _noTelpController.text,
            _emailController.text,
            tglMasuk,
            _fotoController.text,
          );

          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Data karyawan berhasil diperbarui')),
          );

          Navigator.of(context).pop(true);
        } catch (e) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Error: $e')),
          );
        }
      }
    }
  }



  @override
  void dispose() {
    _namaDepanController.dispose();
    _namaBelakangController.dispose();
    _tanggalLahirController.dispose();
    _alamatController.dispose();
    _noTelpController.dispose();
    _emailController.dispose();
    _tanggalMasukController.dispose();
    _fotoController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Karyawan'),
        actions: [
          Padding(
            padding: EdgeInsets.only(right: 8),
            child: IconButton(
              onPressed: editKaryawan,
              icon: Icon(Icons.check),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.all(20),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Hero(
                    tag: 'profile',
                    child: Container(
                      width: 170,
                      height: 170,
                      clipBehavior: Clip.antiAlias,
                      decoration: BoxDecoration(
                        boxShadow: const [],
                        color: Colors.grey,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Image.network(
                        widget.dataKaryawan['foto'],
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  SizedBox(height: 35),
                  Text(
                    '${widget.dataKaryawan['nama_depan']} ${widget.dataKaryawan['nama_belakang']}',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  Text(
                    '${widget.dataKaryawan['posisi']['nama_posisi']}',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w300,
                    ),
                  ),
                  SizedBox(height: 20),
                  Container(
                    padding: EdgeInsets.all(15),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.grey.withOpacity(0.5),
                          spreadRadius: 1,
                          blurRadius: 4,
                          offset: Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: _buildTextFormField(
                                controller: _namaDepanController,
                                hintText: 'Nama Depan',
                                textInputType: TextInputType.text,
                              ),
                            ),
                            SizedBox(width: 15),
                            Expanded(
                              child: _buildTextFormField(
                                controller: _namaBelakangController,
                                hintText: 'Nama Belakang',
                                textInputType: TextInputType.text,
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 15),
                        // DropdownButtonFormField<String>(
                        //   decoration: InputDecoration(
                        //     hintText: 'Jenis Kelamin',
                        //     hintStyle: TextStyle(
                        //       color: Color.fromRGBO(108, 125, 137, 1),
                        //       fontWeight: FontWeight.w400,
                        //     ),
                        //     border: OutlineInputBorder(
                        //       borderRadius: BorderRadius.all(Radius.circular(10)),
                        //     ),
                        //     contentPadding: EdgeInsets.symmetric(vertical: 15, horizontal: 10),
                        //   ),
                        //   items: [
                        //     DropdownMenuItem(
                        //       value: 'Laki-Laki',
                        //       child: Text('Laki-Laki'),
                        //     ),
                        //     DropdownMenuItem(
                        //       value: 'Perempuan',
                        //       child: Text('Perempuan'),
                        //     ),
                        //   ],
                        //   onChanged: (value) {
                        //     setState(() {
                        //       _selectedGender = value;
                        //     });
                        //   },
                        //   value: _selectedGender,
                        //   validator: (value) {
                        //     if (value == null || value.isEmpty) {
                        //       return 'Jenis kelamin harus dipilih';
                        //     }
                        //     return null;
                        //   },
                        // ),

                        SizedBox(height: 15),
                        _buildDateFormField(
                          hintText: 'Tanggal Lahir',
                          controller: _tanggalLahirController,
                          onTap: () => _selectDate(context, _tanggalLahirController),
                        ),
                        SizedBox(height: 15),
                        _buildTextFormField(
                          controller: _alamatController,
                          hintText: 'Alamat',
                          textInputType: TextInputType.text,
                        ),
                        SizedBox(height: 15),
                        _buildTextFormField(
                          controller: _noTelpController,
                          hintText: 'Nomor Telpon',
                          textInputType: TextInputType.phone,
                        ),
                        SizedBox(height: 15),
                        _buildTextFormField(
                          controller: _emailController,
                          hintText: 'Email',
                          textInputType: TextInputType.emailAddress,
                        ),
                        SizedBox(height: 15),
                        _buildDateFormField(
                          hintText: 'Tanggal Masuk',
                          controller: _tanggalMasukController,
                          onTap: () => _selectDate(context, _tanggalMasukController),
                        ),
                        SizedBox(height: 15),
                        _buildTextFormField(
                          controller: _fotoController,
                          hintText: 'Foto',
                          textInputType: TextInputType.url,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
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
  }) {
    return TextFormField(
      controller: controller,
      keyboardType: textInputType,
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: TextStyle(
          color: Color.fromRGBO(108, 125, 137, 1),
          fontWeight: FontWeight.w400,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(10)),
        ),
      ),
      validator: (value) {
        if (value == null || value.isEmpty) {
          return '$hintText harus diisi';
        }
        return null;
      },
    );
  }

  Widget _buildDateFormField({
    required String hintText,
    required TextEditingController controller,
    required VoidCallback onTap,
  }) {
    return TextFormField(
      controller: controller,
      readOnly: true,
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
        suffixIcon: Icon(Icons.calendar_today),
      ),
      validator: (value) {
        if (value == null || value.isEmpty) {
          return '$hintText harus dipilih';
        }
        return null;
      },
    );
  }
}

class EditUser extends StatefulWidget {
  const EditUser({super.key});

  @override
  State<EditUser> createState() => _EditUserState();
}

class _EditUserState extends State<EditUser> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Edit User'),
        actions: [
          Padding(
            padding: EdgeInsets.only(right: 8),
            child: IconButton(
              onPressed: (){},
              icon: Icon(Icons.check),
            ),
          ),
        ],
      ),
    );
  }
}


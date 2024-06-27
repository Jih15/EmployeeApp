import 'package:flutter/material.dart';
import 'package:line_icons/line_icons.dart';

class EditProfile extends StatefulWidget {

  final Map<String, dynamic> dataKaryawan;

  const EditProfile({super.key, required this.dataKaryawan});

  @override
  State<EditProfile> createState() => _EditProfileState();
}

class _EditProfileState extends State<EditProfile> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Profile'),
      ),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Center(
              child: Hero(
                tag: 'profile',
                child: Container(
                  width: 200,
                  height: 200,
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
            ),
            SizedBox(height: 35,),

          ],
        )
      ),
    );
  }
}

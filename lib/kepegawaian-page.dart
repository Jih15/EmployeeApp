import 'package:flutter/material.dart';

class KepegawaianPage extends StatefulWidget {
  const KepegawaianPage({super.key});

  @override
  State<KepegawaianPage> createState() => _KepegawaianPageState();
}

class _KepegawaianPageState extends State<KepegawaianPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        centerTitle: true,
        title: Text('Kepegawaian'),
      ),
      body: Center(
        child: Text('Kepegawaian Page'),
      ),
    );
  }
}

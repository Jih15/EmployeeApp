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
      backgroundColor: Colors.blue,
      appBar: AppBar(
        centerTitle: true,
        title: const Text('Kepegawaian'),
      ),
      body: const Center(
        child: Text('Kepegawaian Page'),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

class LoadingScreen extends StatelessWidget {
  const LoadingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            LoadingAnimationWidget.fourRotatingDots(
              color: const Color.fromRGBO(52, 119, 167, 1),
              size: 50,
            ),
            const SizedBox(height: 20,),
            Text(
              'Logging In...',
              style: const TextStyle(
                  fontSize: 18
              ),
            ).animate().fade(delay: 100.ms).slide(curve: Curves.easeIn),
          ],
        ),
      ),
    );
  }
}

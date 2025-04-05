import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return  Scaffold(
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 17, 8, 66),
        title: Text(
          'iScope',
          style: TextStyle(
            color: Colors.white,
            fontStyle: FontStyle.italic
          ),
        ),
        centerTitle: true,
      ),
    );
  }
}
// import 'package:fl_chart/fl_chart.dart';
// import 'package:flutter/material.dart';
//
// class TestChart extends StatelessWidget {
//   final Map<String, dynamic> evaluationDataList;
//
//   const TestChart({Key? key, required this.evaluationDataList}) : super(key: key);
//
//   @override
//   Widget build(BuildContext context) {
//     return BarChart(
//       BarChartData(
//         barTouchData: barTouchData,
//         titlesData: titlesData,
//         borderData: borderData,
//         barGroups: barGroups,
//         gridData: const FlGridData(show: false),
//         alignment: BarChartAlignment.spaceAround,
//         maxY: 20, // Adjust according to your data
//       ),
//     );
//   }
//
//   BarTouchData get barTouchData => BarTouchData(
//     enabled: false,
//     touchTooltipData: BarTouchTooltipData(
//       getTooltipColor: (group) => Colors.transparent,
//       tooltipPadding: EdgeInsets.zero,
//       tooltipMargin: 8,
//       getTooltipItem: (
//           BarChartGroupData group,
//           int groupIndex,
//           BarChartRodData rod,
//           int rodIndex,
//           ) {
//         return BarTooltipItem(
//           rod.toY.toString(),
//           const TextStyle(
//             color: Color.fromRGBO(61, 211, 165, 1.0),
//             fontWeight: FontWeight.bold,
//           ),
//         );
//       },
//     ),
//   );
//
//   Widget getTitles(double value, TitleMeta meta) {
//     const style = TextStyle(
//       color: Color.fromRGBO(27, 59, 86, 1.0),
//       fontWeight: FontWeight.bold,
//       fontSize: 14,
//     );
//     return SideTitleWidget(
//       axisSide: meta.axisSide,
//       space: 4,
//       child: Text(evaluationDataList[value.toInt()].month, style: style),
//     );
//   }
//
//   FlTitlesData get titlesData => FlTitlesData(
//     show: true,
//     bottomTitles: AxisTitles(
//       sideTitles: SideTitles(
//         showTitles: true,
//         reservedSize: 30,
//         getTitlesWidget: getTitles,
//       ),
//     ),
//     leftTitles: const AxisTitles(
//       sideTitles: SideTitles(showTitles: false),
//     ),
//     topTitles: const AxisTitles(
//       sideTitles: SideTitles(showTitles: false),
//     ),
//     rightTitles: const AxisTitles(
//       sideTitles: SideTitles(showTitles: false),
//     ),
//   );
//
//   FlBorderData get borderData => FlBorderData(
//     show: false,
//   );
//
//   LinearGradient get _barsGradient => const LinearGradient(
//     colors: [
//       Color.fromRGBO(27, 59, 86, 1.0),
//       Color.fromRGBO(61, 211, 165, 1.0),
//     ],
//     begin: Alignment.bottomCenter,
//     end: Alignment.topCenter,
//   );
//
//   List<BarChartGroupData> get barGroups {
//     return evaluationDataList.asMap().entries.map((entry) {
//       final index = entry.key;
//       final data = entry.value;
//       return BarChartGroupData(
//         x: index,
//         barRods: [
//           BarChartRodData(
//             toY: data.rating,
//             color: _barsGradient.colors[0],
//           )
//         ],
//         showingTooltipIndicators: [0],
//       );
//     }).toList();
//   }
// }

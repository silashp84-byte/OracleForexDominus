import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

export default function RealtimeChart({ data, pair }) {
  const screenWidth = Dimensions.get('window').width;

  const chartData = useMemo(() => {
    if (data.length === 0) return { labels: [], datasets: [{ data: [0] }] };

    const recent = data.slice(-60);
    
    const labels = recent.map((_, idx) => 
      idx % 10 === 0 ? idx.toString() : ''
    );
    
    const prices = recent.map((d) => d.price || 0);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return {
      labels,
      datasets: [
        {
          data: prices,
          color: () => '#00D4FF',
          strokeWidth: 2,
        },
      ],
      min: minPrice,
      max: maxPrice,
    };
  }, [data]);

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth - 40}
        height={250}
        chartConfig={{
          backgroundColor: '#0f0f1e',
          backgroundGradientFrom: '#1a1a2e',
          backgroundGradientTo: '#0f0f1e',
          color: (opacity = 1) => `rgba(0, 212, 255, ${opacity})`,
          strokeWidth: 2,
          useShadowColorFromDataset: false,
          decimalPlaces: 5,
          propsForLabels: {
            fontSize: 10,
            fill: '#888',
          },
          propsForBackgroundLines: {
            stroke: '#333',
            strokeDasharray: '5, 5',
          },
        }}
        style={{
          borderRadius: 10,
        }}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        withDots={true}
        withShadow={false}
        fromZero={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f0f1e',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
});
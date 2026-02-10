import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function PriceCard({ pair }) {
  const isPositive = pair.change >= 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.symbol}>{pair.symbol}</Text>
        <View style={[styles.badge, isPositive ? styles.positive : styles.negative]}>
          <Text style={styles.badgeText}>
            {isPositive ? '▲' : '▼'} {Math.abs(pair.change)}%
          </Text>
        </View>
      </View>
      <Text style={styles.price}>{pair.price?.toFixed(5)}</Text>
      <View style={styles.footer}>
        <Text style={styles.label}>Alta: {pair.high?.toFixed(5)}</Text>
        <Text style={styles.label}>Baixa: {pair.low?.toFixed(5)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#00D4FF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  symbol: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  positive: {
    backgroundColor: '#00FF0020',
  },
  negative: {
    backgroundColor: '#FF444420',
  },
  badgeText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  price: {
    color: '#00D4FF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  label: {
    color: '#888',
    fontSize: 12,
  },
});
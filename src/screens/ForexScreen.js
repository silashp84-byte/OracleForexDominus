import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import ForexService from '../services/forexService';
import PriceCard from '../components/PriceCard';
import RealtimeChart from '../components/RealtimeChart';

export default function ForexScreen() {
  const [forexPairs, setForexPairs] = useState([]);
  const [selectedPair, setSelectedPair] = useState('EURUSD');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const pairs = [
    { symbol: 'EURUSD', name: 'EUR/USD', flag: '🇪🇺🇺🇸' },
    { symbol: 'GBPUSD', name: 'GBP/USD', flag: '🇬🇧🇺🇸' },
    { symbol: 'USDJPY', name: 'USD/JPY', flag: '🇺🇸🇯🇵' },
    { symbol: 'AUDUSD', name: 'AUD/USD', flag: '🇦🇺🇺🇸' },
    { symbol: 'USDCAD', name: 'USD/CAD', flag: '🇺🇸🇨🇦' },
    { symbol: 'NZDUSD', name: 'NZD/USD', flag: '🇳🇿🇺🇸' },
  ];

  useEffect(() => {
    initializeForex();
  }, []);

  useEffect(() => {
    subscribeToForexData(selectedPair);
  }, [selectedPair]);

  const initializeForex = async () => {
    try {
      setLoading(true);
      const data = await ForexService.initializePairs(pairs);
      setForexPairs(data);
      await subscribeToForexData(selectedPair);
    } catch (error) {
      console.error('Erro ao inicializar Forex:', error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToForexData = async (pair) => {
    try {
      const unsubscribe = ForexService.subscribe(pair, (data) => {
        setForexPairs((prev) =>
          prev.map((p) =>
            p.symbol === pair ? { ...p, ...data, updated: true } : p
          )
        );
        setChartData((prev) => [...prev.slice(-59), data]);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Erro ao inscrever em dados:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await initializeForex();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#00D4FF" />
        <Text style={styles.loadingText}>Carregando dados de Forex...</Text>
      </View>
    );
  }

  const selectedData = forexPairs.find((p) => p.symbol === selectedPair);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.pairsContainer}>
        {forexPairs.map((pair) => (
          <TouchableOpacity
            key={pair.symbol}
            style={[
              styles.pairCard,
              selectedPair === pair.symbol && styles.selectedCard,
            ]}
            onPress={() => setSelectedPair(pair.symbol)}
          >
            <Text style={styles.pairFlag}>{pair.flag}</Text>
            <Text style={styles.pairName}>{pair.name}</Text>
            <Text
              style={[
                styles.pairPrice,
                pair.change >= 0 ? styles.positive : styles.negative,
              ]}
            >
              {pair.price?.toFixed(5) || '-'}
            </Text>
            <Text
              style={[
                styles.pairChange,
                pair.change >= 0 ? styles.positive : styles.negative,
              ]}
            >
              {pair.change >= 0 ? '+' : ''}{pair.change?.toFixed(2)}%
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedData && (
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>{selectedData.name} - Detalhes</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Preço Atual</Text>
              <Text style={styles.detailValue}>{selectedData.price?.toFixed(5)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Mudança</Text>
              <Text
                style={[
                  styles.detailValue,
                  selectedData.change >= 0 ? styles.positive : styles.negative,
                ]}
              >
                {selectedData.change >= 0 ? '+' : ''}{selectedData.change?.toFixed(2)}%
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Máxima</Text>
              <Text style={styles.detailValue}>{selectedData.high?.toFixed(5)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Mínima</Text>
              <Text style={styles.detailValue}>{selectedData.low?.toFixed(5)}</Text>
            </View>
          </View>

          <View style={styles.chartSection}>
            <Text style={styles.chartTitle}>Gráfico em Tempo Real - Últimas 60 velas</Text>
            {chartData.length > 0 ? (
              <RealtimeChart data={chartData} pair={selectedPair} />
            ) : (
              <View style={styles.chartPlaceholder}>
                <ActivityIndicator size="large" color="#00D4FF" />
                <Text style={styles.placeholderText}>Carregando gráfico...</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
    padding: 10,
  },
  loadingText: {
    color: '#00D4FF',
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
  },
  pairsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pairCard: {
    width: '48%',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#333',
  },
  selectedCard: {
    borderColor: '#00D4FF',
    backgroundColor: '#16213e',
  },
  pairFlag: {
    fontSize: 24,
    marginBottom: 5,
  },
  pairName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  pairPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  pairChange: {
    fontSize: 12,
  },
  positive: {
    color: '#00FF00',
  },
  negative: {
    color: '#FF4444',
  },
  detailsSection: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  detailsTitle: {
    color: '#00D4FF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    width: '48%',
    backgroundColor: '#0f0f1e',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  detailLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5,
  },
  detailValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartSection: {
    marginTop: 15,
  },
  chartTitle: {
    color: '#00D4FF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chartPlaceholder: {
    backgroundColor: '#0f0f1e',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 250,
  },
  placeholderText: {
    color: '#888',
    marginTop: 10,
  },
});
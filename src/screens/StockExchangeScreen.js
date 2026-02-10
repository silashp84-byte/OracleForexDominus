import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  RefreshControl,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ExchangeService from '../services/exchangeService';

export default function StockExchangeScreen() {
  const [exchanges, setExchanges] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadExchanges();
  }, []);

  const loadExchanges = async () => {
    try {
      setRefreshing(true);
      const data = await ExchangeService.getExchangeStatus();
      setExchanges(data);
    } catch (error) {
      console.error('Erro ao carregar bolsas:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    await loadExchanges();
  };

  const ExchangeCard = ({ exchange }) => {
    const isOpen = exchange.isOpen;
    const nextEvent = exchange.nextEvent;

    return (
      <View style={styles.exchangeCard}>
        <View style={styles.exchangeHeader}>
          <View>
            <Text style={styles.exchangeName}>{exchange.name}</Text>
            <Text style={styles.exchangeCountry}>{exchange.country}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              isOpen ? styles.statusOpen : styles.statusClosed,
            ]}
          >
            <Ionicons
              name={isOpen ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={isOpen ? '#00FF00' : '#FF4444'}
            />
            <Text style={styles.statusText}>{isOpen ? 'ABERTA' : 'FECHADA'}</Text>
          </View>
        </View>

        <View style={styles.timingSection}>
          <View style={styles.timingItem}>
            <Text style={styles.timingLabel}>Abertura</Text>
            <Text style={styles.timingValue}>{exchange.openTime}</Text>
          </View>
          <View style={styles.timingItem}>
            <Text style={styles.timingLabel}>Encerramento</Text>
            <Text style={styles.timingValue}>{exchange.closeTime}</Text>
          </View>
          <View style={styles.timingItem}>
            <Text style={styles.timingLabel}>Fuso Horário</Text>
            <Text style={styles.timingValue}>{exchange.timezone}</Text>
          </View>
        </View>

        {nextEvent && (
          <View style={styles.nextEventSection}>
            <Ionicons name="alarm" size={16} color="#00D4FF" />
            <Text style={styles.nextEventText}>
              {nextEvent.type === 'open'
                ? `Abre em ${nextEvent.timeUntil}`
                : `Fecha em ${nextEvent.timeUntil}`}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Horários das Principais Bolsas</Text>
        <Text style={styles.headerSubtitle}>Tempo: UTC-0 (Horário de Referência)</Text>
      </View>

      {exchanges.length > 0 ? (
        exchanges.map((exchange) => (
          <ExchangeCard key={exchange.id} exchange={exchange} />
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhuma bolsa disponível</Text>
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
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    color: '#00D4FF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    color: '#888',
    fontSize: 12,
  },
  exchangeCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#00D4FF',
  },
  exchangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  exchangeName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  exchangeCountry: {
    color: '#888',
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusOpen: {
    backgroundColor: '#00FF0020',
  },
  statusClosed: {
    backgroundColor: '#FF444420',
  },
  statusText: {
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: 12,
    color: '#fff',
  },
  timingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  timingItem: {
    flex: 1,
  },
  timingLabel: {
    color: '#888',
    fontSize: 11,
    marginBottom: 3,
  },
  timingValue: {
    color: '#00D4FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  nextEventSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f0f1e',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  nextEventText: {
    color: '#00D4FF',
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '600',
  },
  emptyState: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
  },
});
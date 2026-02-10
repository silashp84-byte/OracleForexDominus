import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PortfolioScreen() {
  const [portfolio, setPortfolio] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    symbol: '',
    quantity: '',
    entryPrice: '',
  });

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const data = await AsyncStorage.getItem('portfolio');
      if (data) {
        const items = JSON.parse(data);
        setPortfolio(items);
        calculateTotal(items);
      }
    } catch (error) {
      console.error('Erro ao carregar portfólio:', error);
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.entryPrice,
      0
    );
    setTotalValue(total);
  };

  const addPosition = async () => {
    if (!formData.symbol || !formData.quantity || !formData.entryPrice) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const newPosition = {
      id: Date.now(),
      symbol: formData.symbol.toUpperCase(),
      quantity: parseFloat(formData.quantity),
      entryPrice: parseFloat(formData.entryPrice),
      timestamp: new Date().toISOString(),
    };

    const updated = [...portfolio, newPosition];
    setPortfolio(updated);
    calculateTotal(updated);
    await AsyncStorage.setItem('portfolio', JSON.stringify(updated));
    setFormData({ symbol: '', quantity: '', entryPrice: '' });
    setModalVisible(false);
  };

  const removePosition = async (id) => {
    const updated = portfolio.filter((item) => item.id !== id);
    setPortfolio(updated);
    calculateTotal(updated);
    await AsyncStorage.setItem('portfolio', JSON.stringify(updated));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Valor Total do Portfolio</Text>
          <Text style={styles.totalValue}>${totalValue.toFixed(2)}</Text>
        </View>

        {portfolio.length > 0 ? (
          portfolio.map((position) => (
            <View key={position.id} style={styles.positionCard}>
              <View style={styles.positionHeader}> 
                <View>
                  <Text style={styles.symbol}>{position.symbol}</Text>
                  <Text style={styles.details}>
                    {position.quantity} unidades @ ${position.entryPrice.toFixed(2)}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => removePosition(position.id)}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="trash" size={20} color="#FF4444" />
                </TouchableOpacity>
              </View>
              <View style={styles.totalPosition}>
                <Text style={styles.totalPositionLabel}>Investimento Total</Text>
                <Text style={styles.totalPositionValue}>
                  ${(position.quantity * position.entryPrice).toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={48} color="#888" />
            <Text style={styles.emptyText}>Nenhuma posição aberta</Text>
            <Text style={styles.emptySubtext}>
              Adicione uma posição para começar
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fabButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Adicionar Posição</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#00D4FF" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Símbolo (ex: EURUSD)"
              placeholderTextColor="#666"
              value={formData.symbol}
              onChangeText={(text) =>
                setFormData({ ...formData, symbol: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Quantidade"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
              value={formData.quantity}
              onChangeText={(text) =>
                setFormData({ ...formData, quantity: text })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Preço de Entrada"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
              value={formData.entryPrice}
              onChangeText={(text) =>
                setFormData({ ...formData, entryPrice: text })
              }
            />

            <TouchableOpacity
              style={styles.submitButton}
              onPress={addPosition}
            >
              <Text style={styles.submitButtonText}>Adicionar Posição</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  scrollView: {
    padding: 15,
    paddingBottom: 80,
  },
  totalCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00D4FF',
  },
  totalLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 10,
  },
  totalValue: {
    color: '#00D4FF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  positionCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00D4FF',
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  symbol: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  details: {
    color: '#888',
    fontSize: 12,
  },
  deleteBtn: {
    padding: 8,
  },
  totalPosition: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  totalPositionLabel: {
    color: '#888',
    fontSize: 11,
    marginBottom: 5,
  },
  totalPositionValue: {
    color: '#00FF00',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00D4FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    color: '#00D4FF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#0f0f1e',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#333',
  },
  submitButton: {
    backgroundColor: '#00D4FF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

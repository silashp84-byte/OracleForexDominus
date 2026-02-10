import axios from 'axios';

const FINNHUB_API_KEY = 'YOUR_FINNHUB_API_KEY';

const forexSubscriptions = {};

export default class ForexService {
  static async initializePairs(pairs) {
    try {
      const forexData = pairs.map((pair) => ({
        ...pair,
        price: Math.random() * 2 + 0.5,
        change: (Math.random() - 0.5) * 10,
        high: Math.random() * 2 + 0.7,
        low: Math.random() * 2 + 0.3,
      }));
      return forexData;
    } catch (error) {
      console.error('Erro ao inicializar pares:', error);
      return [];
    }
  }

  static subscribe(pair, callback) {
    const interval = setInterval(() => {
      const randomChange = (Math.random() - 0.5) * 0.001;
      callback({
        symbol: pair,
        price: (Math.random() * 2 + 0.5),
        change: (Math.random() - 0.5) * 10,
        timestamp: new Date().toISOString(),
      });
    }, 1000);

    forexSubscriptions[pair] = interval;

    return () => {
      clearInterval(interval);
      delete forexSubscriptions[pair];
    };
  }

  static unsubscribeAll() {
    Object.values(forexSubscriptions).forEach((interval) => {
      clearInterval(interval);
    });
  }
}
import moment from 'moment';

const exchanges = [
  {
    id: 1,
    name: 'NYSE (Bolsa de Valores de Nova York)',
    country: '🇺🇸 Estados Unidos',
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'EST/EDT (UTC-5/-4)',
  },
  {
    id: 2,
    name: 'NASDAQ',
    country: '🇺🇸 Estados Unidos',
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'EST/EDT (UTC-5/-4)',
  },
  {
    id: 3,
    name: 'LSE (Bolsa de Valores de Londres)',
    country: '🇬🇧 Reino Unido',
    openTime: '08:00',
    closeTime: '16:30',
    timezone: 'GMT/BST (UTC+0/+1)',
  },
  {
    id: 4,
    name: 'Euronext',
    country: '🇪🇺 Europa',
    openTime: '09:00',
    closeTime: '17:30',
    timezone: 'CET/CEST (UTC+1/+2)',
  },
  {
    id: 5,
    name: 'Tokyo Stock Exchange (TSE)',
    country: '🇯🇵 Japão',
    openTime: '09:00',
    closeTime: '15:00',
    timezone: 'JST (UTC+9)',
  },
  {
    id: 6,
    name: 'Hong Kong Stock Exchange (HKEX)',
    country: '🇭🇰 Hong Kong',
    openTime: '09:30',
    closeTime: '16:00',
    timezone: 'HKT (UTC+8)',
  },
  {
    id: 7,
    name: 'B3 (Bolsa Brasileira)',
    country: '🇧🇷 Brasil',
    openTime: '10:00',
    closeTime: '17:55',
    timezone: 'BRT/BRST (UTC-3/-2)',
  },
  {
    id: 8,
    name: 'ASX (Bolsa Australiana)',
    country: '🇦🇺 Austrália',
    openTime: '10:00',
    closeTime: '16:00',
    timezone: 'AEST/AEDT (UTC+10/+11)',
  },
];

export default class ExchangeService {
  static async getExchangeStatus() {
    return exchanges.map((exchange) => {
      const now = moment();
      const dayOfWeek = now.day();
      
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      const isOpen = !isWeekend && now.hour() >= 9 && now.hour() < 17;

      return {
        ...exchange,
        isOpen,
        nextEvent: isOpen
          ? { type: 'close', timeUntil: '8h 30m' }
          : { type: 'open', timeUntil: '12h 15m' },
      };
    });
  }
}
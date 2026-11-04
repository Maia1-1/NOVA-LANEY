export interface TradingInstrument {
  symbol: string;
  displayName: string;
  category: 'Forex' | 'Metales';
  baseCurrency: string;
  quoteCurrency: string;
  description: string;
}

export const TRADING_INSTRUMENTS: TradingInstrument[] = [
  {
    symbol: 'EURUSD',
    displayName: 'EUR/USD',
    category: 'Forex',
    baseCurrency: 'EUR',
    quoteCurrency: 'USD',
    description: 'Euro frente al dólar estadounidense'
  },
  {
    symbol: 'GBPUSD',
    displayName: 'GBP/USD',
    category: 'Forex',
    baseCurrency: 'GBP',
    quoteCurrency: 'USD',
    description: 'Libra esterlina frente al dólar estadounidense'
  },
  {
    symbol: 'USDJPY',
    displayName: 'USD/JPY',
    category: 'Forex',
    baseCurrency: 'USD',
    quoteCurrency: 'JPY',
    description: 'Dólar estadounidense frente al yen japonés'
  },
  {
    symbol: 'XAUUSD',
    displayName: 'XAU/USD - Oro',
    category: 'Metales',
    baseCurrency: 'XAU',
    quoteCurrency: 'USD',
    description: 'Oro frente al dólar estadounidense'
  }
];

export function getInstrument(
  symbol: string
): TradingInstrument | undefined {
  return TRADING_INSTRUMENTS.find(
    instrument => instrument.symbol === symbol
  );
}

export function getInstrumentsByCategory(
  category: TradingInstrument['category']
): TradingInstrument[] {
  return TRADING_INSTRUMENTS.filter(
    instrument => instrument.category === category
  );
}


import type { Trade, TradingAccount } from '../types';

const TRADES_KEY = 'nova-laney-trades';
const ACCOUNT_KEY = 'nova-laney-account';

const DEFAULT_ACCOUNT: TradingAccount = {
  initialCapital: 100,
  currency: 'USD'
};

// Obtener todas las operaciones guardadas
export function getTrades(): Trade[] {
  try {
    const data = localStorage.getItem(TRADES_KEY);

    if (!data) return [];

    const trades: unknown = JSON.parse(data);

    if (!Array.isArray(trades)) return [];

    return trades as Trade[];
  } catch (error) {
    console.error('Error al recuperar las operaciones:', error);
    return [];
  }
}

// Guardar las operaciones
export function saveTrades(trades: Trade[]): void {
  localStorage.setItem(TRADES_KEY, JSON.stringify(trades));
}

// Agregar una operación
export function addTrade(trade: Trade): void {
  const trades = getTrades();

  trades.push(trade);

  saveTrades(trades);
}

// Eliminar una operación
export function deleteTrade(id: number): void {
  const trades = getTrades().filter(
    trade => trade.id !== id
  );

  saveTrades(trades);
}

// Obtener la configuración de la cuenta
export function getAccount(): TradingAccount {
  try {
    const data = localStorage.getItem(ACCOUNT_KEY);

    if (!data) return { ...DEFAULT_ACCOUNT };

    return {
      ...DEFAULT_ACCOUNT,
      ...JSON.parse(data)
    };
  } catch (error) {
    console.error('Error al recuperar la cuenta:', error);
    return { ...DEFAULT_ACCOUNT };
  }
}

// Guardar la configuración de la cuenta
export function saveAccount(account: TradingAccount): void {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
}

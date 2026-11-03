// Modelo que representa una operación de trading
export interface Trade {
  id: number;
  date: string;
  asset: string;

  // Tipo de operación
  direction: 'Compra' | 'Venta';

  // Datos de entrada y salida
  entryPrice: number;
  exitPrice: number;
  quantity: number;

  // Gestión del riesgo
  stopLoss: number;
  takeProfit: number;
  riskAmount: number;

  // Costos y resultado financiero
  commission: number;
  profitLoss: number;

  // Resultado de la operación
  result: 'Ganadora' | 'Perdedora' | 'Breakeven';

  // Comentarios adicionales
  notes: string;
}

// Configuración de la cuenta
export interface TradingAccount {
  initialCapital: number;
  currency: 'USD' | 'COP';
}

// Estadísticas generales
export interface TradingStatistics {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakevenTrades: number;
  winRate: number;
  totalProfit: number;
  totalLoss: number;
  netProfit: number;
  profitFactor: number;
}
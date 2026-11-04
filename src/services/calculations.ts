
import type {
  Trade,
  TradingStatistics
} from '../types';

// Especificaciones necesarias para calcular un instrumento
export interface InstrumentCalculationSpec {
  contractSize: number;
  quoteToUSD: number;
  profitCurrency: string;
}

// Calcular la ganancia o pérdida bruta con especificaciones
export function calculateInstrumentGrossProfit(
  direction: 'Compra' | 'Venta',
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  spec: InstrumentCalculationSpec
): number {
  if (
    !Number.isFinite(entryPrice) ||
    !Number.isFinite(exitPrice) ||
    !Number.isFinite(quantity) ||
    !Number.isFinite(spec.contractSize) ||
    !Number.isFinite(spec.quoteToUSD) ||
    entryPrice <= 0 ||
    exitPrice <= 0 ||
    quantity <= 0 ||
    spec.contractSize <= 0 ||
    spec.quoteToUSD <= 0
  ) {
    throw new Error(
      'Los datos del instrumento no son válidos.'
    );
  }

  const priceDifference = direction === 'Compra'
    ? exitPrice - entryPrice
    : entryPrice - exitPrice;

  const profitInQuoteCurrency =
    priceDifference * quantity * spec.contractSize;

  return profitInQuoteCurrency * spec.quoteToUSD;
}

// Función provisional para mantener compatibilidad
// con el formulario anterior.
// NO utilizar para calcular operaciones reales.
export function calculateGrossProfit(
  direction: 'Compra' | 'Venta',
  entryPrice: number,
  exitPrice: number,
  quantity: number
): number {
  if (direction === 'Compra') {
    return (exitPrice - entryPrice) * quantity;
  }

  return (entryPrice - exitPrice) * quantity;
}

// Calcular el resultado neto descontando comisiones
export function calculateNetProfit(
  grossProfit: number,
  commission: number
): number {
  if (
    !Number.isFinite(grossProfit) ||
    !Number.isFinite(commission) ||
    commission < 0
  ) {
    throw new Error('Los valores financieros no son válidos.');
  }

  return grossProfit - commission;
}

// Determinar automáticamente el resultado
export function calculateResult(
  profitLoss: number
): 'Ganadora' | 'Perdedora' | 'Breakeven' {
  if (profitLoss > 0) return 'Ganadora';
  if (profitLoss < 0) return 'Perdedora';

  return 'Breakeven';
}

// Calcular el porcentaje de operaciones ganadoras
export function calculateWinRate(trades: Trade[]): number {
  if (trades.length === 0) return 0;

  const winners = trades.filter(
    trade => trade.profitLoss > 0
  ).length;

  return (winners / trades.length) * 100;
}

// Calcular estadísticas generales
export function calculateStatistics(
  trades: Trade[]
): TradingStatistics {
  const winningTrades = trades.filter(
    trade => trade.profitLoss > 0
  );

  const losingTrades = trades.filter(
    trade => trade.profitLoss < 0
  );

  const breakevenTrades = trades.filter(
    trade => trade.profitLoss === 0
  );

  const totalProfit = winningTrades.reduce(
    (total, trade) => total + trade.profitLoss,
    0
  );

  const totalLoss = losingTrades.reduce(
    (total, trade) => total + Math.abs(trade.profitLoss),
    0
  );

  const netProfit = trades.reduce(
    (total, trade) => total + trade.profitLoss,
    0
  );

  const profitFactor =
    totalLoss === 0
      ? (totalProfit > 0 ? Infinity : 0)
      : totalProfit / totalLoss;

  return {
    totalTrades: trades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    breakevenTrades: breakevenTrades.length,
    winRate: calculateWinRate(trades),
    totalProfit,
    totalLoss,
    netProfit,
    profitFactor
  };
}

// Calcular el balance actual
export function calculateBalance(
  initialCapital: number,
  trades: Trade[]
): number {
  const netProfit = trades.reduce(
    (total, trade) => total + trade.profitLoss,
    0
  );

  return initialCapital + netProfit;
}

// Calcular el drawdown máximo porcentual
export function calculateMaxDrawdown(
  initialCapital: number,
  trades: Trade[]
): number {
  let balance = initialCapital;
  let peak = initialCapital;
  let maximumDrawdown = 0;

  const orderedTrades = [...trades].sort(
    (a, b) =>
      a.date.localeCompare(b.date) || a.id - b.id
  );

  for (const trade of orderedTrades) {
    balance += trade.profitLoss;
    peak = Math.max(peak, balance);

    if (peak > 0) {
      const drawdown =
        ((peak - balance) / peak) * 100;

      maximumDrawdown = Math.max(
        maximumDrawdown,
        drawdown
      );
    }
  }

  return maximumDrawdown;
}

// Calcular la expectativa promedio por operación
export function calculateExpectancy(
  trades: Trade[]
): number {
  if (trades.length === 0) return 0;

  const netProfit = trades.reduce(
    (total, trade) => total + trade.profitLoss,
    0
  );

  return netProfit / trades.length;
}

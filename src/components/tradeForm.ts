
import {
  calculateGrossProfit,
  calculateNetProfit,
  calculateResult
} from '../services/calculations';

import { addTrade } from '../services/storage';
import type { Trade } from '../types';

// Instrumentos habilitados en NOVA LANEY
const TRADING_INSTRUMENTS = [
  {
    category: 'Forex - Pares principales',
    instruments: [
      { value: 'EURUSD', label: 'EUR/USD' },
      { value: 'GBPUSD', label: 'GBP/USD' },
      { value: 'USDJPY', label: 'USD/JPY' }
    ]
  },
  {
    category: 'Metales',
    instruments: [
      { value: 'XAUUSD', label: 'XAU/USD - Oro' }
    ]
  }
];

// Mostrar el formulario de registro
export function renderTradeForm(): string {
  const instrumentOptions = TRADING_INSTRUMENTS.map(group => `
    <optgroup label="${group.category}">
      ${group.instruments.map(instrument => `
        <option value="${instrument.value}">
          ${instrument.label}
        </option>
      `).join('')}
    </optgroup>
  `).join('');

  return `
    <section class="panel trade-form-panel">

      <div class="panel-header">
        <div>
          <h2>Registrar operación</h2>
          <p>Ingresa los datos de tu operación de trading.</p>
        </div>
      </div>

      <form id="trade-form" class="trade-form">

        <div class="form-grid">

          <div class="form-group">
            <label for="trade-date">Fecha</label>
            <input type="date" id="trade-date" required>
          </div>

          <div class="form-group">
            <label for="trade-asset">Instrumento</label>
            <select id="trade-asset" required>
              <option value="">Seleccionar instrumento</option>
              ${instrumentOptions}
            </select>
          </div>

          <div class="form-group">
            <label for="trade-direction">Dirección</label>
            <select id="trade-direction" required>
              <option value="Compra">Compra (Buy)</option>
              <option value="Venta">Venta (Sell)</option>
            </select>
          </div>

          <div class="form-group">
            <label for="trade-quantity">Volumen (lotes)</label>
            <input
              type="number"
              id="trade-quantity"
              min="0.01"
              step="0.01"
              value="0.01"
              required
            >
          </div>

          <div class="form-group">
            <label for="trade-entry">Precio de entrada</label>
            <input
              type="number"
              id="trade-entry"
              min="0.00001"
              step="any"
              required
            >
          </div>

          <div class="form-group">
            <label for="trade-exit">Precio de salida</label>
            <input
              type="number"
              id="trade-exit"
              min="0.00001"
              step="any"
              required
            >
          </div>

          <div class="form-group">
            <label for="trade-stop">Stop Loss</label>
            <input
              type="number"
              id="trade-stop"
              min="0.00001"
              step="any"
              required
            >
          </div>

          <div class="form-group">
            <label for="trade-target">Take Profit</label>
            <input
              type="number"
              id="trade-target"
              min="0.00001"
              step="any"
              required
            >
          </div>

          <div class="form-group">
            <label for="trade-commission">Comisión (USD)</label>
            <input
              type="number"
              id="trade-commission"
              min="0"
              step="0.01"
              value="0"
              required
            >
          </div>

          <div class="form-group">
            <label for="trade-risk">Riesgo monetario (USD)</label>
            <input
              type="number"
              id="trade-risk"
              min="0"
              step="0.01"
              value="0"
              required
            >
          </div>

        </div>

        <div class="form-group">
          <label for="trade-notes">Notas de la operación</label>
          <textarea
            id="trade-notes"
            rows="3"
            placeholder="Describe la estrategia, motivo de entrada o comentarios..."
          ></textarea>
        </div>

        <div class="trade-preview" id="trade-preview">
          El resultado se calculará al registrar la operación.
        </div>

        <button type="submit" class="primary-button">
          Guardar operación
        </button>

      </form>
    </section>
  `;
}

// Activar el formulario
export function setupTradeForm(): void {
  const form = document.querySelector<HTMLFormElement>('#trade-form');

  if (!form) return;

  // Establecer la fecha actual
  const dateInput = document.querySelector<HTMLInputElement>(
    '#trade-date'
  );

  if (dateInput) {
    dateInput.value = new Date().toLocaleDateString('en-CA');
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const date = getValue('trade-date');
    const asset = getValue('trade-asset');

    const direction = getValue(
      'trade-direction'
    ) as 'Compra' | 'Venta';

    const entryPrice = getNumber('trade-entry');
    const exitPrice = getNumber('trade-exit');
    const quantity = getNumber('trade-quantity');
    const stopLoss = getNumber('trade-stop');
    const takeProfit = getNumber('trade-target');
    const commission = getNumber('trade-commission');
    const riskAmount = getNumber('trade-risk');
    const notes = getValue('trade-notes');

    if (
      !date ||
      !asset ||
      entryPrice <= 0 ||
      exitPrice <= 0 ||
      quantity < 0.01 ||
      stopLoss <= 0 ||
      takeProfit <= 0 ||
      commission < 0 ||
      riskAmount < 0
    ) {
      alert('Verifica los datos ingresados.');
      return;
    }

    // Calcular ganancia o pérdida
    const grossProfit = calculateGrossProfit(
      direction,
      entryPrice,
      exitPrice,
      quantity
    );

    const profitLoss = calculateNetProfit(
      grossProfit,
      commission
    );

    const result = calculateResult(profitLoss);

    // Crear el registro
    const trade: Trade = {
      id: Date.now(),
      date,
      asset,
      direction,
      entryPrice,
      exitPrice,
      quantity,
      stopLoss,
      takeProfit,
      riskAmount,
      commission,
      profitLoss,
      result,
      notes
    };

    // Guardar en almacenamiento local
    addTrade(trade);

    alert(
      `Operación guardada correctamente.\n\n` +
      `Instrumento: ${asset}\n` +
      `Resultado: ${result}\n` +
      `Ganancia/Pérdida: ${profitLoss.toFixed(2)} USD`
    );

    form.reset();

    if (dateInput) {
      dateInput.value = new Date().toLocaleDateString('en-CA');
    }

    const quantityInput = document.querySelector<HTMLInputElement>(
      '#trade-quantity'
    );

    if (quantityInput) quantityInput.value = '0.01';

    const commissionInput = document.querySelector<HTMLInputElement>(
      '#trade-commission'
    );

    if (commissionInput) commissionInput.value = '0';

    const riskInput = document.querySelector<HTMLInputElement>(
      '#trade-risk'
    );

    if (riskInput) riskInput.value = '0';
  });
}

// Obtener valores de texto
function getValue(id: string): string {
  const element = document.getElementById(id) as
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
    | null;

  return element?.value.trim() ?? '';
}

// Obtener valores numéricos
function getNumber(id: string): number {
  return Number(getValue(id));
}


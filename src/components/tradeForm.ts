
import {
  calculateInstrumentGrossProfit,
  calculateNetProfit,
  calculateResult
} from '../services/calculations';

import { addTrade } from '../services/storage';
import type { Trade } from '../types';

import {
  TRADING_INSTRUMENTS,
  getInstrument
} from '../data/instruments';

// Mostrar el formulario de registro
export function renderTradeForm(): string {
  const categories = ['Forex', 'Metales'] as const;

  const instrumentOptions = categories.map(category => {
    const instruments = TRADING_INSTRUMENTS.filter(
      instrument => instrument.category === category
    );

    return `
      <optgroup label="${category}">
        ${instruments.map(instrument => `
          <option value="${instrument.symbol}">
            ${instrument.displayName}
          </option>
        `).join('')}
      </optgroup>
    `;
  }).join('');

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
            <label for="trade-contract">Tamaño del contrato</label>
            <input
              type="number"
              id="trade-contract"
              min="0.00001"
              step="any"
              placeholder="Consultar especificaciones"
              required
            >
          </div>

          <div class="form-group">
            <label for="trade-conversion">Conversión a USD</label>
            <input
              type="number"
              id="trade-conversion"
              min="0.00000001"
              step="any"
              placeholder="Consultar conversión"
              required
            >
          </div>

          <div class="form-group">
            <label for="trade-currency">Moneda de beneficio</label>
            <select id="trade-currency" required>
              <option value="">Seleccionar moneda</option>
              <option value="USD">USD</option>
              <option value="JPY">JPY</option>
            </select>
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
          El resultado se calculará utilizando las especificaciones ingresadas.
          Verifica los datos con tu bróker.
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

  const dateInput = document.querySelector<HTMLInputElement>(
    '#trade-date'
  );

  if (dateInput) {
    dateInput.value = new Date().toLocaleDateString('en-CA');
  }

  form.addEventListener('submit', event => {
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
    const contractSize = getNumber('trade-contract');
    const quoteToUSD = getNumber('trade-conversion');
    const profitCurrency = getValue('trade-currency');
    const commission = getNumber('trade-commission');
    const riskAmount = getNumber('trade-risk');
    const notes = getValue('trade-notes');

    const instrument = getInstrument(asset);

    if (!instrument) {
      alert('Selecciona un instrumento válido del catálogo.');
      return;
    }

    if (
      !date ||
      !profitCurrency ||
      entryPrice <= 0 ||
      exitPrice <= 0 ||
      quantity < 0.01 ||
      stopLoss <= 0 ||
      takeProfit <= 0 ||
      contractSize <= 0 ||
      quoteToUSD <= 0 ||
      commission < 0 ||
      riskAmount < 0
    ) {
      alert('Verifica los datos ingresados y las especificaciones del instrumento.');
      return;
    }

    // Comprobar que los niveles de protección tengan sentido
    if (
      (direction === 'Compra' && stopLoss >= entryPrice) ||
      (direction === 'Compra' && takeProfit <= entryPrice) ||
      (direction === 'Venta' && stopLoss <= entryPrice) ||
      (direction === 'Venta' && takeProfit >= entryPrice)
    ) {
      alert(
        'Los niveles de Stop Loss y Take Profit no corresponden a la dirección seleccionada.'
      );
      return;
    }

    // Verificar la moneda de beneficio del instrumento
    if (profitCurrency !== instrument.quoteCurrency) {
      alert(
        `La moneda de beneficio esperada para ${instrument.displayName} es ${instrument.quoteCurrency}.`
      );
      return;
    }

    try {
      const grossProfit = calculateInstrumentGrossProfit(
        direction,
        entryPrice,
        exitPrice,
        quantity,
        {
          contractSize,
          quoteToUSD,
          profitCurrency
        }
      );

      const profitLoss = calculateNetProfit(
        grossProfit,
        commission
      );

      const result = calculateResult(profitLoss);

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
        contractSize,
        quoteToUSD,
        profitCurrency,
        commission,
        profitLoss,
        result,
        notes
      };

      addTrade(trade);

      alert(
        `Operación guardada correctamente.\n\n` +
        `Instrumento: ${instrument.displayName}\n` +
        `Resultado: ${result}\n` +
        `Ganancia/Pérdida estimada: ${profitLoss.toFixed(2)} USD`
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

    } catch (error) {
      console.error('Error al calcular la operación:', error);
      alert(
        'No se pudo calcular la operación. Verifica las especificaciones ingresadas.'
      );
    }
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

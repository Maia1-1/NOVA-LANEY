
import {
  getTrades,
  deleteTrade
} from '../services/storage';

import type { Trade } from '../types';

// Formatear valores monetarios
function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
}

// Evitar interpretar datos como HTML
function escapeHTML(value: string): string {
  return value.replace(/[&<>"']/g, character => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };

    return entities[character];
  });
}

// Mostrar el historial de operaciones
export function renderHistory(): string {
  const trades = getTrades().sort(
    (a, b) =>
      b.date.localeCompare(a.date) || b.id - a.id
  );

  if (trades.length === 0) {
    return `
      <section class="panel transactions-panel">
        <h3>Historial de operaciones</h3>

        <div class="empty-state">
          <div class="empty-icon">▤</div>
          <strong>No hay operaciones registradas</strong>
          <p>Las operaciones que registres aparecerán aquí.</p>
        </div>
      </section>
    `;
  }

  const totalProfit = trades.reduce(
    (total, trade) => total + trade.profitLoss,
    0
  );

  const rows = trades.map((trade: Trade) => {
    const resultClass = trade.profitLoss > 0
      ? 'positive'
      : trade.profitLoss < 0
        ? 'negative'
        : '';

    return `
      <tr>
        <td>${escapeHTML(trade.date)}</td>
        <td>${escapeHTML(trade.asset)}</td>
        <td>${escapeHTML(trade.direction)}</td>
        <td>${trade.quantity.toFixed(2)}</td>
        <td>${formatMoney(trade.entryPrice)}</td>
        <td>${formatMoney(trade.exitPrice)}</td>
        <td class="${resultClass}">
          ${formatMoney(trade.profitLoss)}
        </td>
        <td>${escapeHTML(trade.result)}</td>
        <td>
          <button
            type="button"
            class="secondary-button"
            data-delete-trade="${trade.id}"
          >
            Eliminar
          </button>
        </td>
      </tr>
    `;
  }).join('');

  return `
    <section class="panel transactions-panel">

      <div class="panel-header">
        <div>
          <h3>Historial de operaciones</h3>
          <p>${trades.length} operaciones registradas</p>
        </div>
      </div>

      <div class="summary-item">
        <span>Resultado neto acumulado</span>
        <strong class="${totalProfit >= 0 ? 'positive' : 'negative'}">
          ${formatMoney(totalProfit)}
        </strong>
      </div>

      <div class="history-table-container">
        <table class="history-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Instrumento</th>
              <th>Dirección</th>
              <th>Lotes</th>
              <th>Entrada</th>
              <th>Salida</th>
              <th>Resultado</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>

          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>

    </section>
  `;
}

// Activar la eliminación de operaciones
export function setupHistory(): void {
  const container = document.querySelector<HTMLDivElement>(
    '#view-container'
  );

  if (!container) return;

  container.addEventListener('click', event => {
    const target = event.target as HTMLElement;

    const button = target.closest<HTMLButtonElement>(
      '[data-delete-trade]'
    );

    if (!button) return;

    const id = Number(button.dataset.deleteTrade);

    if (!Number.isSafeInteger(id)) return;

    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar esta operación?'
    );

    if (!confirmed) return;

    deleteTrade(id);

    // Actualizar el historial
    container.innerHTML = renderHistory();
  });
}

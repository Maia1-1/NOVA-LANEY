
import {
  getAccount,
  getTrades
} from '../services/storage';

import {
  calculateBalance
} from '../services/calculations';

// Límites de riesgo definidos para NOVA LANEY
const RISK_PER_TRADE = 3;
const DAILY_LOSS_LIMIT = 3;
const MINIMUM_CAPITAL = 100;

// Formatear cantidades en USD
function formatMoney(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

// Calcular los límites de riesgo
export function renderRiskCalculator(): string {
  const account = getAccount();
  const trades = getTrades();

  const currentBalance = calculateBalance(
    account.initialCapital,
    trades
  );

  const referenceCapital = Math.max(
    MINIMUM_CAPITAL,
    currentBalance
  );

  const operationRisk =
    referenceCapital * (RISK_PER_TRADE / 100);

  const dailyLossLimit =
    referenceCapital * (DAILY_LOSS_LIMIT / 100);

  return `
    <section class="panel trade-form-panel">

      <div class="panel-header">
        <div>
          <h3>Gestor de riesgo</h3>
          <p>Control del capital y exposición financiera.</p>
        </div>
      </div>

      <div class="metrics-grid">

        <article class="metric-card">
          <span class="metric-label">CAPITAL DE REFERENCIA</span>
          <h3>${formatMoney(referenceCapital)}</h3>
        </article>

        <article class="metric-card">
          <span class="metric-label">RIESGO POR OPERACIÓN</span>
          <h3 class="negative">${formatMoney(operationRisk)}</h3>
          <span class="metric-description">3 % del capital</span>
        </article>

        <article class="metric-card">
          <span class="metric-label">PÉRDIDA MÁXIMA DIARIA</span>
          <h3 class="negative">${formatMoney(dailyLossLimit)}</h3>
          <span class="metric-description">3 % del capital</span>
        </article>

      </div>

      <div class="trade-preview">
        <strong>Reglas de protección de NOVA LANEY</strong>

        <p>
          El riesgo máximo permitido por operación es del 3 %.
        </p>

        <p>
          El límite de pérdida diaria es del 3 %.
        </p>

        <p>
          Capital mínimo de referencia: 100 USD.
        </p>

        <p>
          Volumen mínimo previsto: 0.01 lotes, sujeto a las
          especificaciones del instrumento.
        </p>
      </div>

      <div class="panel-header">
        <div>
          <h3>Estado del gestor de riesgo</h3>
          <p>Parámetros de protección configurados.</p>
        </div>
      </div>

      <div class="summary-item">
        <span>Riesgo por operación</span>
        <strong>3 %</strong>
      </div>

      <div class="summary-item">
        <span>Pérdida diaria máxima</span>
        <strong>3 %</strong>
      </div>

      <div class="summary-item">
        <span>Apalancamiento de referencia</span>
        <strong>1:2000</strong>
      </div>

      <div class="summary-item">
        <span>Modalidad</span>
        <strong>Cuenta demo</strong>
      </div>

    </section>
  `;
}

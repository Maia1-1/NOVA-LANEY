
import './style.css';

import {
  renderTradeForm,
  setupTradeForm
} from './components/tradeForm';

import {
  renderAccountSettings,
  setupAccountSettings
} from './components/accountSettings';

import {
  renderRiskCalculator
} from './components/riskCalculator';

import {
  renderHistory,
  setupHistory
} from './components/history';

import {
  getTrades,
  getAccount
} from './services/storage';

import {
  calculateStatistics,
  calculateBalance,
  calculateMaxDrawdown,
  calculateExpectancy
} from './services/calculations';

import type { Trade } from './types';

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

// Obtener las operaciones recientes
function getRecentTrades(): Trade[] {
  return [...getTrades()]
    .sort((a, b) =>
      b.date.localeCompare(a.date) || b.id - a.id
    )
    .slice(0, 5);
}

// Construir el panel principal
function renderDashboard(): string {
  const trades = getTrades();
  const account = getAccount();

  const statistics = calculateStatistics(trades);

  const balance = calculateBalance(
    account.initialCapital,
    trades
  );

  const recentTrades = getRecentTrades();

  const recentRows = recentTrades.length > 0
    ? recentTrades.map(trade => `
        <tr>
          <td>${escapeHTML(trade.date)}</td>
          <td>${escapeHTML(trade.asset)}</td>
          <td>${escapeHTML(trade.direction)}</td>
          <td class="${trade.profitLoss >= 0 ? 'positive' : 'negative'}">
            ${formatMoney(trade.profitLoss)}
          </td>
          <td>${escapeHTML(trade.result)}</td>
        </tr>
      `).join('')
    : `
        <tr>
          <td colspan="5">Todavía no hay operaciones registradas.</td>
        </tr>
      `;

  return `
    <section class="metrics-grid">

      <article class="metric-card">
        <span class="metric-label">CAPITAL ACTUAL</span>
        <h3>${formatMoney(balance)}</h3>
        <span class="metric-description">Capital inicial más resultados registrados</span>
      </article>

      <article class="metric-card">
        <span class="metric-label">OPERACIONES</span>
        <h3>${statistics.totalTrades}</h3>
        <span class="metric-description">Total de operaciones registradas</span>
      </article>

      <article class="metric-card">
        <span class="metric-label">TASA DE ACIERTO</span>
        <h3>${statistics.winRate.toFixed(2)}%</h3>
        <span class="metric-description">Operaciones ganadoras</span>
      </article>

      <article class="metric-card">
        <span class="metric-label">RESULTADO NETO</span>
        <h3 class="${statistics.netProfit >= 0 ? 'positive' : 'negative'}">
          ${formatMoney(statistics.netProfit)}
        </h3>
        <span class="metric-description">Ganancias menos pérdidas</span>
      </article>

    </section>

    <div class="content-grid">

      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Rendimiento de la cuenta</h3>
            <p>Resumen financiero de las operaciones registradas.</p>
          </div>
        </div>

        <div class="summary-item">
          <span>Capital inicial</span>
          <strong>${formatMoney(account.initialCapital)}</strong>
        </div>

        <div class="summary-item">
          <span>Ganancias acumuladas</span>
          <strong class="positive">${formatMoney(statistics.totalProfit)}</strong>
        </div>

        <div class="summary-item">
          <span>Pérdidas acumuladas</span>
          <strong class="negative">${formatMoney(statistics.totalLoss)}</strong>
        </div>

        <div class="summary-item">
          <span>Factor de beneficio</span>
          <strong>
            ${Number.isFinite(statistics.profitFactor)
              ? statistics.profitFactor.toFixed(2)
              : '∞'}
          </strong>
        </div>

        <div class="summary-item">
          <span>Drawdown máximo</span>
          <strong>${calculateMaxDrawdown(account.initialCapital, trades).toFixed(2)}%</strong>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <h3>Resumen de operaciones</h3>
            <p>Distribución de resultados.</p>
          </div>
        </div>

        <div class="summary-item">
          <span>Ganadoras</span>
          <strong class="positive">${statistics.winningTrades}</strong>
        </div>

        <div class="summary-item">
          <span>Perdedoras</span>
          <strong class="negative">${statistics.losingTrades}</strong>
        </div>

        <div class="summary-item">
          <span>Breakeven</span>
          <strong>${statistics.breakevenTrades}</strong>
        </div>

        <div class="summary-item">
          <span>Expectativa por operación</span>
          <strong>${formatMoney(calculateExpectancy(trades))}</strong>
        </div>
      </section>

    </div>

    <section class="panel transactions-panel">
      <div class="panel-header">
        <div>
          <h3>Operaciones recientes</h3>
          <p>Últimos movimientos registrados.</p>
        </div>

        <button class="secondary-button" data-go-to="history">
          Ver historial
        </button>
      </div>

      <div class="history-table-container">
        <table class="history-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Instrumento</th>
              <th>Dirección</th>
              <th>Resultado</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            ${recentRows}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

// Mostrar estadísticas
function renderStatistics(): string {
  const trades = getTrades();
  const account = getAccount();
  const statistics = calculateStatistics(trades);

  const balance = calculateBalance(
    account.initialCapital,
    trades
  );

  return `
    <section class="metrics-grid">

      <article class="metric-card">
        <span class="metric-label">TOTAL DE OPERACIONES</span>
        <h3>${statistics.totalTrades}</h3>
      </article>

      <article class="metric-card">
        <span class="metric-label">TASA DE ACIERTO</span>
        <h3>${statistics.winRate.toFixed(2)}%</h3>
      </article>

      <article class="metric-card">
        <span class="metric-label">RESULTADO NETO</span>
        <h3 class="${statistics.netProfit >= 0 ? 'positive' : 'negative'}">
          ${formatMoney(statistics.netProfit)}
        </h3>
      </article>

      <article class="metric-card">
        <span class="metric-label">BALANCE ACTUAL</span>
        <h3>${formatMoney(balance)}</h3>
      </article>

    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <h3>Estadísticas de NOVA LANEY</h3>
          <p>Análisis de los resultados registrados en el diario.</p>
        </div>
      </div>

      <div class="summary-item">
        <span>Operaciones ganadoras</span>
        <strong class="positive">${statistics.winningTrades}</strong>
      </div>

      <div class="summary-item">
        <span>Operaciones perdedoras</span>
        <strong class="negative">${statistics.losingTrades}</strong>
      </div>

      <div class="summary-item">
        <span>Operaciones breakeven</span>
        <strong>${statistics.breakevenTrades}</strong>
      </div>

      <div class="summary-item">
        <span>Ganancia total</span>
        <strong class="positive">${formatMoney(statistics.totalProfit)}</strong>
      </div>

      <div class="summary-item">
        <span>Pérdida total</span>
        <strong class="negative">${formatMoney(statistics.totalLoss)}</strong>
      </div>

      <div class="summary-item">
        <span>Factor de beneficio</span>
        <strong>
          ${Number.isFinite(statistics.profitFactor)
            ? statistics.profitFactor.toFixed(2)
            : '∞'}
        </strong>
      </div>

      <div class="summary-item">
        <span>Drawdown máximo</span>
        <strong>
          ${calculateMaxDrawdown(account.initialCapital, trades).toFixed(2)}%
        </strong>
      </div>

      <div class="summary-item">
        <span>Expectativa por operación</span>
        <strong>${formatMoney(calculateExpectancy(trades))}</strong>
      </div>
    </section>
  `;
}

// Actualizar el título de la sección
function updatePageTitle(title: string): void {
  const pageTitle = document.querySelector<HTMLHeadingElement>(
    '#page-title'
  );

  const breadcrumb = document.querySelector<HTMLElement>(
    '#breadcrumb'
  );

  if (pageTitle) pageTitle.textContent = title;
  if (breadcrumb) breadcrumb.textContent = title;
}

// Cambiar entre las diferentes secciones
function renderView(view: string): void {
  const container = document.querySelector<HTMLDivElement>(
    '#view-container'
  );

  if (!container) return;

  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    trades: 'Diario de operaciones',
    risk: 'Calculadora de riesgo',
    statistics: 'Estadísticas',
    history: 'Historial',
    account: 'Configuración de cuenta'
  };

  const title = titles[view] ?? 'Dashboard';

  updatePageTitle(title);

  document.querySelectorAll<HTMLElement>('.nav-item').forEach(item => {
    item.classList.toggle(
      'active',
      item.dataset.view === view
    );
  });

  switch (view) {
    case 'dashboard':
      container.innerHTML = renderDashboard();
      break;

    case 'trades':
      container.innerHTML = renderTradeForm();
      setupTradeForm();
      break;

    case 'risk':
      container.innerHTML = renderRiskCalculator();
      break;

    case 'statistics':
      container.innerHTML = renderStatistics();
      break;

    case 'history':
      container.innerHTML = renderHistory();
      setupHistory();
      break;

    case 'account':
      container.innerHTML = renderAccountSettings();
      setupAccountSettings();
      break;

    default:
      container.innerHTML = renderDashboard();
      break;
  }
}

// Construir la aplicación
const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('No se encontró el contenedor principal de NOVA LANEY.');
}

app.innerHTML = `
  <div class="app-layout">

    <aside class="sidebar">

      <div class="brand">
        <div class="brand-icon">N</div>
        <div>
          <h2>NOVA LANEY</h2>
          <span>TRADING SYSTEM</span>
        </div>
      </div>

      <nav class="sidebar-nav">

        <p class="nav-label">GENERAL</p>

        <button class="nav-item active" data-view="dashboard">
          <span>▦</span>
          Dashboard
        </button>

        <button class="nav-item" data-view="trades">
          <span>＋</span>
          Diario de operaciones
        </button>

        <button class="nav-item" data-view="risk">
          <span>◈</span>
          Calculadora de riesgo
        </button>

        <button class="nav-item" data-view="statistics">
          <span>▤</span>
          Estadísticas
        </button>

        <button class="nav-item" data-view="history">
          <span>◷</span>
          Historial
        </button>

        <p class="nav-label">CONFIGURACIÓN</p>

        <button class="nav-item" data-view="account">
          <span>⚙</span>
          Configuración de cuenta
        </button>

      </nav>

      <div class="sidebar-footer">
        <span class="status-indicator"></span>
        <span>Modo de desarrollo</span>
      </div>

    </aside>

    <main class="main-content">

      <header class="topbar">
        <div>
          <span id="breadcrumb">Dashboard</span>
          <h1 id="page-title">Dashboard</h1>
        </div>

        <div class="topbar-status">
          <span class="status-indicator"></span>
          Sistema en desarrollo
        </div>
      </header>

      <div id="view-container"></div>

    </main>

  </div>
`;

// Gestionar la navegación
app.addEventListener('click', event => {
  const target = event.target as HTMLElement;

  const navigationButton = target.closest<HTMLButtonElement>(
    '[data-view]'
  );

  const shortcutButton = target.closest<HTMLButtonElement>(
    '[data-go-to]'
  );

  if (navigationButton?.dataset.view) {
    renderView(navigationButton.dataset.view);
    return;
  }

  if (shortcutButton?.dataset.goTo) {
    renderView(shortcutButton.dataset.goTo);
  }
});

// Abrir el dashboard al iniciar
renderView('dashboard');

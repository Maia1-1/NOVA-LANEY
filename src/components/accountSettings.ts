
import {
  getAccount,
  saveAccount
} from '../services/storage';

// Mostrar la configuración de la cuenta
export function renderAccountSettings(): string {
  const account = getAccount();

  return `
    <section class="panel trade-form-panel">

      <div class="panel-header">
        <div>
          <h3>Configuración de cuenta</h3>
          <p>Administra el capital de referencia de NOVA LANEY.</p>
        </div>
      </div>

      <form id="account-settings-form" class="trade-form">

        <div class="form-group">
          <label for="initial-capital">
            Capital inicial (USD)
          </label>

          <input
            type="number"
            id="initial-capital"
            min="100"
            step="0.01"
            value="${account.initialCapital}"
            required
          >

          <small>
            El capital mínimo permitido para esta configuración es 100 USD.
          </small>
        </div>

        <div class="form-group">
          <label for="account-currency">
            Moneda de la cuenta
          </label>

          <select id="account-currency" disabled>
            <option value="USD" selected>USD - Dólar estadounidense</option>
          </select>
        </div>

        <div class="trade-preview">
          El capital configurado será la referencia para los cálculos
          financieros y la gestión de riesgo.
        </div>

        <button type="submit" class="primary-button">
          Guardar configuración
        </button>

        <p id="account-message" role="status"></p>

      </form>
    </section>
  `;
}

// Activar el formulario de configuración
export function setupAccountSettings(): void {
  const form = document.querySelector<HTMLFormElement>(
    '#account-settings-form'
  );

  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();

    const capitalInput = document.querySelector<HTMLInputElement>(
      '#initial-capital'
    );

    const message = document.querySelector<HTMLParagraphElement>(
      '#account-message'
    );

    if (!capitalInput || !message) return;

    const initialCapital = Number(capitalInput.value);

    if (
      !Number.isFinite(initialCapital) ||
      initialCapital < 100
    ) {
      message.textContent = 'El capital mínimo permitido es 100 USD.';
      message.className = 'negative';
      return;
    }

    saveAccount({
      initialCapital,
      currency: 'USD'
    });

    message.textContent = 'Configuración guardada correctamente.';
    message.className = 'positive';
  });
}

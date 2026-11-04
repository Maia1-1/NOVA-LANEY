
const API_URL = 'http://127.0.0.1:8000';

export interface BackendStatus {
  system: string;
  status: string;
  mode: string;
  broker: string;
  platform: string;
  timestamp: string;
}

export interface TradingInstrument {
  symbol: string;
  name: string;
  category: string;
}

export async function getBackendStatus(): Promise<BackendStatus> {
  const response = await fetch(`${API_URL}/api/status`);

  if (!response.ok) {
    throw new Error('No se pudo consultar el estado del backend.');
  }

  return response.json() as Promise<BackendStatus>;
}

export async function getBackendInstruments(): Promise<TradingInstrument[]> {
  const response = await fetch(`${API_URL}/api/instruments`);

  if (!response.ok) {
    throw new Error('No se pudieron consultar los instrumentos.');
  }

  const data = await response.json() as {
    instruments: TradingInstrument[];
  };

  return data.instruments;
}

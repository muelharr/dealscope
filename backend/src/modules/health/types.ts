export interface HealthStatusResponse {
  status: 'UP' | 'DOWN';
  database: 'CONNECTED' | 'DISCONNECTED';
  cache: 'CONNECTED' | 'DISCONNECTED';
  timestamp: string;
}

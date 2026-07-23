export interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  unit?: string;
}

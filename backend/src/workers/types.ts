export interface WorkerResult {
  scanned: number;
  triggered: number;
  skipped: number;
  failed: number;
  durationMs: number;
}

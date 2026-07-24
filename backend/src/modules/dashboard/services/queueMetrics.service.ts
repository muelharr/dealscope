export interface QueueMetrics {
  queueName: string;
  waiting: number;
  active: number;
  delayed: number;
  failed: number;
  completed: number;
}

export interface IQueueMetricsService {
  getMetrics(queueNames: string[]): Promise<QueueMetrics[]>;
}

export class QueueMetricsService implements IQueueMetricsService {
  async getMetrics(queueNames: string[]): Promise<QueueMetrics[]> {
    return queueNames.map((queueName) => ({
      queueName,
      waiting: 0,
      active: 0,
      delayed: 0,
      failed: 0,
      completed: 0,
    }));
  }
}

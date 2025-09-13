
export type ServiceStatus = 'running' | 'stopped' | 'degraded';

export interface Service {
  id: string;
  name: string;
  version?: string;
  status: ServiceStatus;
}

export type DemoStep = 'initial' | 'deploying' | 'v1_deployed' | 'promoting' | 'v2_promoted' | 'failing' | 'rolled_back';

export interface LogEntry {
  command: string;
  output: string;
}

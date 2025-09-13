
import type { Service } from './types';

export const INITIAL_SERVICES: Service[] = [
  { id: 'api-gateway', name: 'API Gateway', status: 'stopped' },
  { id: 'feature-service-v1', name: 'Servicio Demo', version: 'v1', status: 'stopped' },
  { id: 'feature-service-v2', name: 'Servicio Demo', version: 'v2', status: 'stopped' },
  { id: 'registry', name: 'Registry', status: 'stopped' },
];

export const INITIAL_CONFIG = { featureServiceUrl: '' };

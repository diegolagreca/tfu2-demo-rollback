
import type { Service } from './types';

export const INITIAL_SERVICES: Service[] = [
  { id: 'api-gateway', name: 'Pasarela API', status: 'stopped' },
  { id: 'feature-service-v1', name: 'Servicio Func.', version: 'v1', status: 'stopped' },
  { id: 'feature-service-v2', name: 'Servicio Func.', version: 'v2', status: 'stopped' },
  { id: 'registry', name: 'Registro', status: 'stopped' },
];

export const INITIAL_CONFIG = { featureServiceUrl: '' };


import React from 'react';
import type { Service, ServiceStatus } from '../types';

const StatusIndicator: React.FC<{ status: ServiceStatus }> = ({ status }) => {
  const statusClasses = {
    running: 'bg-green-500',
    stopped: 'bg-gray-500',
    degraded: 'bg-red-500 animate-pulse',
  };
  return <span className={`inline-block w-3 h-3 rounded-full ${statusClasses[status]}`}></span>;
};

const translateStatus = (status: ServiceStatus): string => {
  switch (status) {
    case 'running':
      return 'En ejecución';
    case 'stopped':
      return 'Detenido';
    case 'degraded':
      return 'Degradado';
    default:
      return status;
  }
};

export const ServiceStatusList: React.FC<{ services: Service[] }> = ({ services }) => {
  return (
    <div className="space-y-2 bg-gray-900/50 p-4 rounded-lg">
      {services.map(service => (
        <div key={service.id} className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <StatusIndicator status={service.status} />
            <span className="ml-3">{service.name} {service.version && `(${service.version})`}</span>
          </div>
          <span className="font-mono text-gray-400">{translateStatus(service.status)}</span>
        </div>
      ))}
    </div>
  );
};

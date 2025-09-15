
import React from 'react';
import type { Service } from '../types';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { ServiceStatusList } from './ServiceStatusList';
import { ConfigDisplay } from './ConfigDisplay';

interface SystemStateProps {
  services: Service[];
  config: { featureServiceUrl: string };
}

export const SystemState: React.FC<SystemStateProps> = ({ services, config }) => {
  return (
    <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-gray-700/50 flex-grow">
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Estado del Sistema en Vivo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-cyan-400">Architecture</h3>
          <ArchitectureDiagram services={services} config={config} />
        </div>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">Estado de Servicios</h3>
            <ServiceStatusList services={services} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 text-cyan-400">Configuración Gateway</h3>
            <ConfigDisplay config={config} />
          </div>
        </div>
      </div>
    </div>
  );
};

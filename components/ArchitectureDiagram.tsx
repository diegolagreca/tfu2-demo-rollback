
import React from 'react';
import type { Service } from '../types';
import { GatewayIcon, ServerIcon, RegistryIcon } from './icons/Icons';

interface ArchitectureDiagramProps {
  services: Service[];
  config: { featureServiceUrl: string };
}

const ServiceBox: React.FC<{
  icon: React.ReactNode;
  name: string;
  version?: string;
  status: 'running' | 'stopped' | 'degraded';
  isActive?: boolean;
}> = ({ icon, name, version, status, isActive }) => {
  const statusClasses = {
    running: 'border-green-500/80 bg-green-500/10 text-green-300',
    stopped: 'border-gray-600/80 bg-gray-500/10 text-gray-400',
    degraded: 'border-red-500/80 bg-red-500/10 text-red-300',
  };
  const activeClass = isActive ? 'ring-2 ring-cyan-400 shadow-cyan-400/20 shadow-lg' : '';

  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 text-center transition-all duration-300 ${statusClasses[status]} ${activeClass}`}>
      <div className="w-8 h-8">{icon}</div>
      <div className="font-bold text-sm mt-2">{name}</div>
      {version && <div className="text-xs font-mono">{version}</div>}
    </div>
  );
};

const Arrow: React.FC<{ active?: boolean, horizontal?: boolean, reverse?: boolean }> = ({ active, horizontal, reverse }) => {
    const activeClass = active ? 'bg-cyan-400' : 'bg-gray-600';
    const orientationClass = horizontal ? 'w-full h-0.5' : 'h-full w-0.5';
    const directionClass = horizontal ? (reverse ? 'flex-row-reverse' : 'flex-row') : (reverse ? 'flex-col-reverse' : 'flex-col');
    
    return (
        <div className={`flex items-center justify-center ${orientationClass} ${directionClass}`}>
            <div className={`w-full h-full ${activeClass} transition-colors duration-500`}></div>
            <div className={`flex-shrink-0 border-solid ${active ? 'border-cyan-400' : 'border-gray-600'} transition-colors duration-500 ${horizontal ? 'border-t-[4px] border-b-[4px] border-l-[6px] border-r-0 border-transparent' : 'border-l-[4px] border-r-[4px] border-t-[6px] border-b-0 border-transparent'}`}></div>
        </div>
    );
};

export const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ services, config }) => {
  const getStatus = (id: string) => services.find(s => s.id === id)?.status || 'stopped';
  const isV1Active = config.featureServiceUrl.includes('v1') && getStatus('feature-service-v1') === 'running';
  const isV2Active = config.featureServiceUrl.includes('v2') && getStatus('feature-service-v2') === 'running';

  return (
    <div className="p-4 bg-gray-900/50 rounded-lg">
        <div className="grid grid-cols-5 grid-rows-3 gap-x-2 gap-y-4 items-center h-48">
            {/* Row 1 */}
            <div className="col-start-3"><ServiceBox icon={<GatewayIcon />} name="API Gateway" status={getStatus('api-gateway')} /></div>
            
            {/* Connectors */}
            <div className="col-start-3 row-start-2 h-full flex flex-col items-center">
              <div className="w-0.5 h-1/2 bg-gray-600"></div>
              <div className="flex w-full justify-center">
                  <div className="h-0.5 flex-grow bg-gray-600"></div>
              </div>
            </div>
             <div className="col-start-1 row-start-2 h-full flex justify-end items-center"><Arrow active={isV1Active} horizontal reverse /></div>
             <div className="col-start-2 row-start-2 h-full flex items-center"><Arrow active={isV1Active} horizontal /></div>
             <div className="col-start-4 row-start-2 h-full flex justify-end items-center"><Arrow active={isV2Active} horizontal reverse/></div>
             <div className="col-start-5 row-start-2 h-full flex items-center"><Arrow active={isV2Active} horizontal /></div>

            {/* Row 3 */}
            <div className="col-start-1 row-start-3"><ServiceBox icon={<ServerIcon />} name="Feature Service" version="v1" status={getStatus('feature-service-v1')} isActive={isV1Active} /></div>
            <div className="col-start-3 row-start-3"><ServiceBox icon={<RegistryIcon />} name="Registry" status={getStatus('registry')} /></div>
            <div className="col-start-5 row-start-3"><ServiceBox icon={<ServerIcon />} name="Feature Service" version="v2" status={getStatus('feature-service-v2')} isActive={isV2Active} /></div>
        </div>
    </div>
  );
};

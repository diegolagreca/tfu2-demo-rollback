
import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Service, DemoStep, LogEntry } from './types';
import { INITIAL_SERVICES, INITIAL_CONFIG } from './constants';
import { ControlPanel } from './components/ControlPanel';
import { SystemState } from './components/SystemState';
import { Console } from './components/Console';
import { Header } from './components/Header';

const App: React.FC = () => {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [config, setConfig] = useState<{ featureServiceUrl: string }>(INITIAL_CONFIG);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentStep, setCurrentStep] = useState<DemoStep>('initial');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const addLog = useCallback((command: string, output: string) => {
    setLogs(prev => [...prev, { command, output }]);
  }, []);

  const runWithDelay = useCallback(<T,>(fn: () => T, delay: number): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(fn()), delay));
  }, []);

  const handleDeploy = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setCurrentStep('deploying');
    setLogs([]);

    await runWithDelay(() => addLog('./deploy_green.sh', 'Iniciando despliegue inicial (v1)...'), 500);
    await runWithDelay(() => {
      setServices(prev => prev.map(s => ['api-gateway', 'feature-service-v1', 'registry'].includes(s.id) ? { ...s, status: 'running' } : s));
      setConfig({ featureServiceUrl: 'http://feature-v1:4000' });
      addLog('', 'Servicios [api-gateway, feature-service-v1, registry] están ahora en ejecución.');
    }, 1000);
    
    await runWithDelay(() => {
      addLog('', 'Despliegue de v1 completado.');
      setCurrentStep('v1_deployed');
      setIsProcessing(false);
    }, 500);
  }, [addLog, isProcessing, runWithDelay]);

  const handleTest = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    await runWithDelay(() => addLog('./test.sh', 'Verificando estado actual del sistema...'), 500);
    await runWithDelay(() => {
        const version = config.featureServiceUrl.includes('v1') ? 'v1' : 'v2';
        const msg = version === 'v1' 
            ? `"hola desde versión 1. Soy una versión super estable :)"` 
            : `"h0l4 desd3 v3rsi0n 2. NO sol mUyy est4b13 :(`;
        addLog('curl http://localhost:8080/do-feature', `{ "version": "${version}", "msg": ${msg} }`);
        setIsProcessing(false);
    }, 1000);
  }, [config, addLog, isProcessing, runWithDelay]);

  const handlePromote = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setCurrentStep('promoting');
    
    await runWithDelay(() => addLog('./promote_green.sh', 'Promoviendo nueva versión (v2)...'), 500);
    await runWithDelay(() => {
      setServices(prev => prev.map(s => s.id === 'feature-service-v2' ? { ...s, status: 'running' } : s));
      addLog('', 'Servicio [feature-service-v2] está ahora en ejecución.');
    }, 1000);
    await runWithDelay(() => {
      setConfig({ featureServiceUrl: 'http://feature-v2:4000' });
      addLog('', 'Configuración de la Pasarela API actualizada para apuntar a v2.');
    }, 1000);

    await runWithDelay(() => {
        addLog('', 'Promoción a v2 completada.');
        setCurrentStep('v2_promoted');
        setIsProcessing(false);
    }, 500);
  }, [addLog, isProcessing, runWithDelay]);

  const handleRollback = useCallback(async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setCurrentStep('failing');

    await runWithDelay(() => addLog('docker stop feature-v2', 'Simulando falla en v2...'), 500);
    await runWithDelay(() => {
      setServices(prev => prev.map(s => s.id === 'feature-service-v2' ? { ...s, status: 'degraded' } : s));
    }, 1000);

    await runWithDelay(() => addLog('./rollback.sh', 'Falla detectada. Iniciando rollback...'), 1500);
    await runWithDelay(() => {
      setConfig({ featureServiceUrl: 'http://feature-v1:4000' });
      addLog('', 'Configuración de la Pasarela API revertida para apuntar a v1.');
    }, 1000);
    await runWithDelay(() => {
       setServices(prev => prev.map(s => s.id === 'feature-service-v2' ? { ...s, status: 'stopped' } : s));
       addLog('', 'Servicio con fallas [feature-service-v2] desconectado.');
    }, 1000);

     await runWithDelay(() => {
        addLog('', 'Rollback a la versión estable v1 completado.');
        setCurrentStep('rolled_back');
        setIsProcessing(false);
    }, 500);
  }, [addLog, isProcessing, runWithDelay]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ControlPanel
            currentStep={currentStep}
            onDeploy={handleDeploy}
            onTest={handleTest}
            onPromote={handlePromote}
            onRollback={handleRollback}
            isProcessing={isProcessing}
          />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <SystemState services={services} config={config} />
          <Console logs={logs} />
        </div>
      </main>
    </div>
  );
};

export default App;

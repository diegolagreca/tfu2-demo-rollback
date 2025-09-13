
import React from 'react';
import type { DemoStep } from '../types';

interface ControlPanelProps {
  currentStep: DemoStep;
  onDeploy: () => void;
  onTest: () => void;
  onPromote: () => void;
  onRollback: () => void;
  isProcessing: boolean;
}

const StepButton: React.FC<{
  title: string;
  description: string;
  onClick: () => void;
  disabled: boolean;
  stepNumber: number;
}> = ({ title, description, onClick, disabled, stepNumber }) => {
  return (
    <div className="flex items-start">
      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${!disabled ? 'bg-cyan-500' : 'bg-gray-600'} flex items-center justify-center font-bold text-white transition-colors`}>
        {stepNumber}
      </div>
      <div className="ml-4 flex-grow">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">{description}</p>
        <button
          onClick={onClick}
          disabled={disabled}
          className="mt-3 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                     bg-cyan-600 text-white
                     hover:bg-cyan-500 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500"
        >
          {title}
        </button>
      </div>
    </div>
  );
};

export const ControlPanel: React.FC<ControlPanelProps> = ({ currentStep, onDeploy, onTest, onPromote, onRollback, isProcessing }) => {
  const isDeployEnabled = ['initial'].includes(currentStep);
  const isTestEnabled = ['v1_deployed', 'v2_promoted', 'rolled_back'].includes(currentStep);
  const isPromoteEnabled = ['v1_deployed', 'rolled_back'].includes(currentStep);
  const isRollbackEnabled = ['v2_promoted'].includes(currentStep);

  return (
    <div className="bg-gray-800/60 p-6 rounded-lg shadow-lg border border-gray-700/50 h-full">
      <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Demo Interactiva</h2>
      <div className="space-y-8">
        <StepButton 
          stepNumber={1}
          title="Deploy Inicial (v1)"
          description="Inicia el API Gateway, el Registry, y la v1 estable del Servicio demo."
          onClick={onDeploy}
          disabled={!isDeployEnabled || isProcessing}
        />
        <StepButton
          stepNumber={2}
          title="Promover nueva versión (v2)"
          description="Inicia la v2 del Servicio demo y actualiza el API Gateway para dirigirle el tráfico."
          onClick={onPromote}
          disabled={!isPromoteEnabled || isProcessing}
        />
        <StepButton
          stepNumber={3}
          title="Simular Falla y Rollback"
          description="Simula una falla en v2, forzando al sistema a revertir a la v1 estable."
          onClick={onRollback}
          disabled={!isRollbackEnabled || isProcessing}
        />
        <StepButton
          stepNumber={4}
          title="Verificar Estado"
          description="Realiza una llamada de prueba al Servicio demo activo para verificar su versión."
          onClick={onTest}
          disabled={!isTestEnabled || isProcessing}
        />
      </div>
    </div>
  );
};

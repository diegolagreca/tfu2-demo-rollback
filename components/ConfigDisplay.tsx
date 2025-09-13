
import React from 'react';

interface ConfigDisplayProps {
  config: { featureServiceUrl: string };
}

export const ConfigDisplay: React.FC<ConfigDisplayProps> = ({ config }) => {
  const formattedConfig = JSON.stringify({ gateway: config }, null, 2);
  return (
    <pre className="bg-gray-900/50 text-cyan-300 text-xs p-4 rounded-lg overflow-x-auto">
      <code>{`// config.json\n${formattedConfig}`}</code>
    </pre>
  );
};

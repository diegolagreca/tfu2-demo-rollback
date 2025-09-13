
import React, { useRef, useEffect } from 'react';
import type { LogEntry } from '../types';

interface ConsoleProps {
  logs: LogEntry[];
}

export const Console: React.FC<ConsoleProps> = ({ logs }) => {
  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-black/50 p-4 rounded-lg shadow-inner border border-gray-700/50 h-64 flex flex-col">
      <div className="flex-shrink-0 flex items-center mb-2">
        <span className="w-3 h-3 bg-red-500 rounded-full inline-block mr-2"></span>
        <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block mr-2"></span>
        <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
        <span className="ml-auto text-xs font-semibold text-gray-400">bash</span>
      </div>
      <div className="flex-grow overflow-y-auto font-mono text-sm text-gray-300 pr-2">
        {logs.map((log, index) => (
          <div key={index}>
            {log.command && (
               <div className="flex">
                  <span className="text-cyan-400 mr-2">$</span>
                  <span className="text-white">{log.command}</span>
               </div>
            )}
            <div className="whitespace-pre-wrap">{log.output}</div>
          </div>
        ))}
         <div ref={consoleEndRef} />
      </div>
    </div>
  );
};

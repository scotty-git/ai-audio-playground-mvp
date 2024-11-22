'use client'

import React, { useState } from 'react';
import type { CustomParam } from '../types';

interface CustomParametersProps {
  customParams: Record<string, string>;
  onAddParam: (param: CustomParam) => void;
  onRemoveParam: (paramName: string) => void;
}

export function CustomParameters({ customParams, onAddParam, onRemoveParam }: CustomParametersProps) {
  const [newParamName, setNewParamName] = useState('');
  const [newParamValue, setNewParamValue] = useState('');

  const handleAddParam = () => {
    if (newParamName.trim() && newParamValue.trim()) {
      onAddParam({
        name: newParamName.trim(),
        value: newParamValue.trim()
      });
      setNewParamName('');
      setNewParamValue('');
    }
  };

  return (
    <div className="border-t mt-4 pt-4">
      <h3 className="text-lg font-semibold mb-2">Custom Parameters</h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newParamName}
          onChange={(e) => setNewParamName(e.target.value)}
          placeholder="Parameter Name"
          className="flex-1 border rounded px-2 py-1"
        />
        <input
          type="text"
          value={newParamValue}
          onChange={(e) => setNewParamValue(e.target.value)}
          placeholder="Parameter Value"
          className="flex-1 border rounded px-2 py-1"
        />
        <button
          type="button"
          onClick={handleAddParam}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {Object.entries(customParams).map(([name, value]) => (
          <div key={name} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
            <span className="font-medium">{name}:</span>
            <span>{value}</span>
            <button
              type="button"
              onClick={() => onRemoveParam(name)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

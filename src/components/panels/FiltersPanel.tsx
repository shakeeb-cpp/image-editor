import React from 'react';
import { Sparkles } from 'lucide-react';

const FiltersPanel: React.FC = () => {
  const filters = [
    { name: 'None', class: '' },
    { name: 'Grayscale', class: 'grayscale' },
    { name: 'Sepia', class: 'sepia' },
    { name: 'Blur', class: 'blur' },
    { name: 'Vignette', class: 'vignette' },
    { name: 'Vintage', class: 'vintage' },
    { name: 'Cool', class: 'cool' },
    { name: 'Warm', class: 'warm' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <Sparkles className="w-5 h-5 text-slate-400" />
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {filters.map(filter => (
          <button
            key={filter.name}
            className="group relative p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <div className="w-full h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded mb-2 opacity-50 group-hover:opacity-75 transition-opacity" />
            <span className="text-sm text-white">{filter.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FiltersPanel;
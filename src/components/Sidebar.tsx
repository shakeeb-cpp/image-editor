import React from 'react';
import { 
  Plus, 
  RotateCcw, 
  Sliders, 
  Sparkles, 
  Layers, 
  Type, 
  Crop, 
  Circle 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tools = [
    { id: 'upload', icon: Plus, label: 'Upload' },
    { id: 'adjustments', icon: Sliders, label: 'Adjustments' },
    { id: 'filters', icon: Sparkles, label: 'Filters' },
    { id: 'crop', icon: Crop, label: 'Crop' },
    { id: 'rotate', icon: RotateCcw, label: 'Rotate' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'overlay', icon: Layers, label: 'Overlay' },
    { id: 'shapes', icon: Circle, label: 'Shapes' },
  ];
  
  return (
    <div className="w-16 bg-slate-900 border-r border-slate-700 flex flex-col items-center py-4 space-y-2">
      {tools.map(tool => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.id}
            onClick={() => setActiveTab(tool.id)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
              activeTab === tool.id
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={tool.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
};

export default Sidebar;
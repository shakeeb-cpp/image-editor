import React from 'react';
import AdjustmentPanel from './panels/AdjustmentPanel';
import CropPanel from './panels/CropPanel';
import RotationPanel from './panels/RotationPanel';
import TextPanel from './panels/TextPanel';
import FiltersPanel from './panels/FiltersPanel';

interface EditingPanelProps {
  activeTab: string;
}

const EditingPanel: React.FC<EditingPanelProps> = ({ activeTab }) => {
  const renderPanel = () => {
    switch (activeTab) {
      case 'adjustments':
        return <AdjustmentPanel />;
      case 'crop':
        return <CropPanel />;
      case 'rotate':
        return <RotationPanel />;
      case 'text':
        return <TextPanel />;
      case 'filters':
        return <FiltersPanel />;
      default:
        return null;
    }
  };
  
  const panel = renderPanel();
  
  if (!panel) return null;
  
  return (
    <div className="w-80 bg-slate-900 border-l border-slate-700 p-4">
      {panel}
    </div>
  );
};

export default EditingPanel;
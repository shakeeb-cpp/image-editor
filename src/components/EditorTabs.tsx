import React from 'react';
// import { Sliders, Crop, RotateCw, Filter, Type } from 'lucide-react';
import AdjustmentPanel from './panels/AdjustmentPanel';
import CropPanel from './panels/CropPanel';
import RotationPanel from './panels/RotationPanel';
import FilterPanel from './panels/FilterPanel';
import OverlayPanel from './panels/OverlayPanel';
import BgPanel from './panels/BgPanel';
import AiPanel from './panels/AiPanel';

interface EditorTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const EditorTabs: React.FC<EditorTabsProps> = ({ activeTab, setActiveTab }) => {


  console.log(setActiveTab)

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'crop':
        return <CropPanel />;
      case 'rotation':
        return <RotationPanel />;
      case 'adjustments':
        return <AdjustmentPanel />;
      case 'filters':
        return <FilterPanel />;
      case 'overlay':
        return <OverlayPanel />;
      case 'background':
        return <BgPanel />;
      case 'ai':
        return <AiPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex h-screen relative">


      {/* Content panel */}
      {activeTab &&
        <div className="flex-1 absolute z-30 w-full transition-all duration-300 bg-slate-800 md:max-h-full mt-auto max-h-[200px] overflow-auto">
          {renderActivePanel()}
        </div>
      }
    </div>
  );
};

export default EditorTabs;
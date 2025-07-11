import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import ImageUpload from './components/ImageUpload';
import ImagePreview from './components/ImagePreview';
import EditorTabs from './components/EditorTabs';
import Header from './components/Header';
import { Sliders, Crop, RotateCw, Filter, Type, Scissors, Sparkles } from 'lucide-react';

import AdjustmentPanel from './components/panels/AdjustmentPanel';
import CropPanel from './components/panels/CropPanel';
import RotationPanel from './components/panels/RotationPanel';
import FilterPanel from './components/panels/FilterPanel';
import OverlayPanel from './components/panels/OverlayPanel';
import AiPanel from './components/panels/AiPanel';
import BgPanel from './components/panels/BgPanel';

const AppContent: React.FC = () => {
  const { publicId } = useSelector((state: RootState) => state.image);
  const [activeTab, setActiveTab] = useState('none');
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical tablet breakpoint
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const tabs = [
    { id: 'crop', label: 'Crop', icon: Crop },
    { id: 'rotation', label: 'Rotate', icon: RotateCw },
    { id: 'adjustments', label: 'Adjustments', icon: Sliders },
    { id: 'filters', label: 'Filters', icon: Filter },
    { id: 'overlay', label: 'Overlay', icon: Type },
    { id: 'background', label: 'Background', icon: Scissors },
    { id: 'ai', icon: Sparkles, label: 'Ai Magic' },
  ];


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
    <div className="min-h-screen max-h-screen overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col" style={{ height: '100vh' }}>
      {/* Header */}
      <Header />

      {/* Body */}
      <div className={`flex-1 w-full relative overflow-hidden ${!publicId ? 'flex justify-center items-center' : ''}`}>
        {!publicId ? (
          <div className="max-w-2xl mx-auto">
            <ImageUpload />
          </div>
        ) : (
          <div className={`flex ${isMobile ? 'flex-col h-full' : 'h-full'}`}>
            {/* Desktop Layout */}
            {!isMobile && (
              <>
                {/* Left Panel - Editor Tabs (Desktop) */}
                <div className="bg-gray-800 border-r flex  border-gray-700 transition-all duration-300 ease-in-out">
                  {/* Tab Icons */}
                  <div className="flex flex-col bg-gray-900">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(activeTab === tab.id ? 'none' : tab.id)}
                        className={`flex items-center justify-center w-16 h-16 transition-all duration-200 relative group ${activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                          }`}
                        title={tab.label}
                      >
                        <tab.icon className="w-6 h-6" />

                        {/* Active indicator */}
                        {activeTab === tab.id && (
                          <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-400 rounded-l-full" />
                        )}

                        {/* Tooltip */}
                        <div className="absolute left-20 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                          {tab.label}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${activeTab !== 'none' ? 'w-96 opacity-100' : 'w-0 opacity-0'}`}>
                    <div className="w-96 h-full bg-slate-900 border-r border-slate-700 overflow-hidden">
                      <div className="transform transition-all duration-300 ease-in-out">
                        <EditorTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Preview and Actions (Desktop) */}
                <div className="flex-1 flex flex-col justify-center items-center p-6 overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <ImagePreview />
                  </div>
                </div>
              </>
            )}

            {/* Mobile Layout */}
            {isMobile && (
              <>
                {/* Top Panel - Image Preview (Mobile) - 65% height */}
                <div className="flex-1 flex flex-col justify-center items-center p-0 overflow-hidden" >
                  <div className="w-full h-full flex items-center justify-center">
                    <ImagePreview />
                  </div>
                </div>

                {/* Bottom Panel - Editor Tabs (Mobile) - 35% height */}
                <div className="bg-gray-800 border-t border-gray-700 flex flex-col-reverse" >
                  {/* Tab Icons Row */}
                  <div className="flex flex-row justify-around bg-gray-900 border-b border-gray-700">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(activeTab === tab.id ? 'none' : tab.id)}
                        className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-all duration-200 relative ${activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                          }`}
                      >
                        <tab.icon className="w-5 h-5 mb-1" />
                        {/* <span className="text-xs truncate">{tab.label}</span> */}

                        {/* Active indicator */}
                        {/* {activeTab === tab.id && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-blue-400 rounded-b-full" />
                        )} */}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className={`flex-1 transition-all max-h-[300px] mb-1  duration-300 ease-in-out overflow-hidden ${activeTab !== 'none' ? 'opacity-100' : 'opacity-0'}`}>
                    {activeTab !== 'none' && (
                      <div className="w-full h-full bg-slate-900 overflow-auto">
                        <div className="transform transition-all duration-300 ease-in-out">
                          {activeTab &&
                            <>
                              {renderActivePanel()}
                            </>
                          }
                          {/* <EditorTabs activeTab={activeTab} setActiveTab={setActiveTab} /> */}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
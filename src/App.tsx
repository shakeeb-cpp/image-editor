import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import ImageUpload from './components/ImageUpload';
import ImagePreview from './components/ImagePreview';
import EditorTabs from './components/EditorTabs';
// import ActionBar from './components/ActionBar';
// import { Edit3 } from 'lucide-react';
import Header from './components/Header';
import { Sliders, Crop, RotateCw, Filter, Type, Scissors, Sparkles } from 'lucide-react';


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
    { id: 'ai', icon: Sparkles , label: 'Ai Magic' },
  ];

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
          <div className={`flex ${isMobile ? 'flex-col' : 'h-full'}`}>
            {/* Left Panel - Editor Tabs (Desktop) / Bottom Panel (Mobile) */}
            <div className={`${isMobile ? 'order-last fixed bottom-0 left-0 right-0 z-10 ' : 'flex'} bg-gray-800 md:border-r border-gray-700 transition-all duration-300 ease-in-out`}>
              {/* Tab Icons */}
              <div className={`${isMobile ? 'flex flex-row justify-around' : 'flex flex-col'} bg-gray-900`}>
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(activeTab === tab.id ? 'none' : tab.id)}
                    className={`flex items-center justify-center ${isMobile ? 'w-11 h-11' : 'w-16 h-16'} transition-all duration-200 relative group ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                    title={tab.label}
                  >
                    <tab.icon className={`${isMobile ? 'w-6 h-6' : 'w-6 h-6'}`} />

                    {/* Active indicator */}
                    {activeTab === tab.id && (
                      <div className={`absolute ${isMobile ? 'top-0 left-0 right-0 h-1 hidden' : 'right-0 top-0 bottom-0 w-1'} bg-blue-400 ${isMobile ? 'rounded-b-full' : 'rounded-l-full'}`} />
                    )}

                    {/* Tooltip - only on desktop */}
                    {!isMobile && (
                      <div className="absolute left-20 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
                        {tab.label}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                activeTab !== 'none' ? (isMobile ? 'h-auto opacity-100' : 'w-96 opacity-100') : (isMobile ? 'h-0 opacity-0' : 'w-0 opacity-0')
              }`}>
                <div className={`${isMobile ? 'w-full h-[300px] absolute bottom-12 left-0 right-0' : 'w-96 h-full'} bg-slate-900 md:border-r border-slate-700 overflow-hidden`}>
                  <div className="transform transition-all duration-300 ease-in-out">
                    <EditorTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Preview and Actions */}
            <div className={`flex-1 flex flex-col justify-center items-center ${isMobile ? 'pb-16' : 'p-6'} overflow-hidden`}>
              <div className="w-full h-full flex items-center justify-center">
                <ImagePreview />
              </div>
            </div>
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

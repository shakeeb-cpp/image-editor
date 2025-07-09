import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import ImageUpload from './components/ImageUpload';
// import ImagePreview from './components/ImagePreview';
import EditorTabs from './components/EditorTabs';
// import ActionBar from './components/ActionBar';
// import { Edit3 } from 'lucide-react';
import Header from './components/Header';
import { Sliders, Crop, RotateCw, Filter, Type } from 'lucide-react';
import InteractiveCropPreview from './components/InteractiveCropPreview';
import TransformationManager from './components/TransformationManager';



const AppContent: React.FC = () => {
  const { publicId } = useSelector((state: RootState) => state.image);
  const [activeTab, setActiveTab] = useState('none');

  const tabs = [
    { id: 'crop', label: 'Crop', icon: Crop },
    { id: 'rotation', label: 'Rotate', icon: RotateCw },
    { id: 'adjustments', label: 'Adjustments', icon: Sliders },
    { id: 'filters', label: 'Filters', icon: Filter },
    { id: 'overlay', label: 'Overlay', icon: Type },
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
          <div className="flex h-full">
            {/* Left Panel - Editor Tabs */}
            <div className="flex bg-gray-800 border-r border-gray-700 transition-all duration-300 ease-in-out">
              {/* Tab Icons */}
              <div className="flex flex-col bg-gray-900">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(activeTab === tab.id ? 'none' : tab.id)}
                    className={`flex items-center justify-center w-16 h-16 transition-all duration-200 relative group ${
                      activeTab === tab.id
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
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                activeTab !== 'none' ? 'w-96 opacity-100' : 'w-0 opacity-0'
              }`}>
                <div className="w-96 h-full bg-slate-900 border-r border-slate-700 overflow-hidden">
                  <div className="transform transition-all duration-300 ease-in-out">
                    <EditorTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Preview and Actions */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 overflow-hidden">
              {/* {publicId && <ActionBar />} */}
              <div className="w-full h-full flex items-center justify-center">
                <InteractiveCropPreview  />
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
      <TransformationManager />
    </Provider>
  );
}

export default App;
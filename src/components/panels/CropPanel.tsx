import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setCrop, setActive, setPosition, resetCrop } from '../../store/slices/cropSlice';
import { Crop, RotateCcw, AlignVerticalDistributeStart, AlignCenter, AlignVerticalDistributeEnd  } from 'lucide-react';

const CropPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { x, y, width, height, active, position } = useSelector((state: RootState) => state.crop);

  const handleCropChange = (field: 'x' | 'y' | 'width' | 'height', value: number) => {
    dispatch(setCrop({ x, y, width, height, [field]: value }));
  };

  const presetCrops = [
    { name: 'Square', ratio: '1:1', width: 400, height: 400 },
    { name: 'Portrait', ratio: '4:5', width: 320, height: 400 },
    { name: 'Landscape', ratio: '16:9', width: 400, height: 225 },
    { name: 'Instagram', ratio: '1:1', width: 400, height: 400 },
    { name: 'Story', ratio: '9:16', width: 225, height: 400 },
    { name: 'Classic', ratio: '4:3', width: 400, height: 300 },
    { name: 'Wide', ratio: '21:9', width: 400, height: 171 },
    { name: 'Golden', ratio: '1.618:1', width: 400, height: 247 },
    { name: 'A4', ratio: '210:297', width: 350, height: 495 },
    { name: 'Banner', ratio: '3:1', width: 450, height: 150 },
    { name: 'Avatar', ratio: '1:1', width: 300, height: 300 },
    { name: 'Cover', ratio: '16:6', width: 400, height: 150 },
    { name: 'Polaroid', ratio: '1:1.2', width: 400, height: 480 },
    { name: 'Postcard', ratio: '3:2', width: 400, height: 267 },
    { name: 'Poster', ratio: '2:3', width: 267, height: 400 },
    { name: 'Thumbnail', ratio: '16:9', width: 320, height: 180 }
  ];

  const positionOptions = [
    { value: 'top', label: 'Top', icon: AlignVerticalDistributeStart },
    { value: 'center', label: 'Center', icon: AlignCenter },
    { value: 'bottom', label: 'Bottom', icon: AlignVerticalDistributeEnd  }
  ];

  return (
    <div className="bg-slate-800 md:rounded-lg p-3 md:p-6 md:mb-16 pb-8">
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h3 className="text-sm md:text-lg font-semibold text-gray-300">Crop & Resize</h3>
        <button
          onClick={() => dispatch(resetCrop())}
          className="p-1.5 md:p-2 text-gray-500 hover:text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
          title="Reset crop"
        >
          <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
        </button>
      </div>

      <div className="mb-3 md:mb-4">
        <button
          onClick={() => dispatch(setActive(!active))}
          className={`w-full flex items-center justify-center px-3 md:px-4 py-2 md:py-2 rounded-lg text-sm md:text-base font-medium transition-colors ${active
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
          <Crop className="w-3 h-3 md:w-4 md:h-4 mr-2" />
          {active ? 'Crop Active' : 'Enable Crop'}
        </button>
      </div>

      {/* Position Selection */}
      <div className="mb-3 md:mb-4">
        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-2">Crop Position</label>
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {positionOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => dispatch(setPosition(option.value as 'top' | 'center' | 'bottom'))}
                className={`flex items-center justify-center px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
                  position === option.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                <IconComponent className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                <span className="hidden sm:inline">{option.label}</span>
              </button>
            );
          })}
        </div>
        {position === null && (
          <p className="text-red-400 text-xs mt-1">Please select a crop position</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-4 mb-3 md:mb-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-400 mb-1">X Position</label>
          <input
            type="number"
            value={x}
            onChange={(e) => handleCropChange('x', parseInt(e.target.value) || 0)}
            className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-600 rounded-md bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-400 mb-1">Y Position</label>
          <input
            type="number"
            value={y}
            onChange={(e) => handleCropChange('y', parseInt(e.target.value) || 0)}
            className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-600 rounded-md bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-400 mb-1">Width</label>
          <input
            type="number"
            value={width}
            onChange={(e) => handleCropChange('width', parseInt(e.target.value) || 0)}
            className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-600 rounded-md bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-400 mb-1">Height</label>
          <input
            type="number"
            value={height}
            onChange={(e) => handleCropChange('height', parseInt(e.target.value) || 0)}
            className="w-full px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm border border-gray-600 rounded-md bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <h4 className="text-xs md:text-sm font-medium text-gray-400 mb-2">Preset Ratios</h4>
        <div className="grid grid-cols-2 gap-1 md:gap-2">
          {presetCrops.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                dispatch(setCrop({
                  x: x, // Center horizontally
                  y: y, // Center vertically
                  width: preset.width,
                  height: preset.height
                }));
                dispatch(setActive(true));
              }}
              className="px-2 md:px-3 py-1.5 md:py-2 text-xs md:text-sm bg-slate-700 hover:bg-slate-600 rounded-md transition-colors"
            >
              {preset.name}
              <span className="block text-xs text-gray-300">{preset.ratio}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CropPanel;
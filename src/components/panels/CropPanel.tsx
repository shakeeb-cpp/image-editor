import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setPreviewCrop, setActive, resetCrop, applyCrop, cancelCrop } from '../../store/slices/cropSlice';
import { Crop, RotateCcw, Square, Maximize2, Check, X } from 'lucide-react';

const EnhancedCropPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { preview, applied, active, isApplied } = useSelector((state: RootState) => state.crop);
  const { dimensions } = useSelector((state: RootState) => state.image);

  console.log(dimensions)
  const handleCropChange = (field: 'x' | 'y' | 'width' | 'height', value: number) => {
    dispatch(setPreviewCrop({
      ...preview,
      [field]: value
    }));
  };

  const handleApplyCrop = () => {
    dispatch(applyCrop());
    dispatch(setActive(false));
  };

  const handleCancelCrop = () => {
    dispatch(cancelCrop());
  };

  const handleReset = () => {
    dispatch(resetCrop());
  };

  const handleToggleActive = () => {
    dispatch(setActive(!active));
  };

  const presetCrops = [
    { name: 'Square', ratio: '1:1', aspectRatio: 1, icon: Square },
    { name: 'Portrait', ratio: '4:5', aspectRatio: 4 / 5, icon: null },
    { name: 'Landscape', ratio: '16:9', aspectRatio: 16 / 9, icon: null },
    { name: 'Instagram', ratio: '1:1', aspectRatio: 1, icon: null },
    { name: 'Story', ratio: '9:16', aspectRatio: 9 / 16, icon: null },
    { name: 'Classic', ratio: '4:3', aspectRatio: 4 / 3, icon: null },
    { name: 'Wide', ratio: '21:9', aspectRatio: 21 / 9, icon: null },
    { name: 'Golden', ratio: '1.618:1', aspectRatio: 1.618, icon: null },
    { name: 'A4', ratio: '210:297', aspectRatio: 210 / 297, icon: null },
    { name: 'Banner', ratio: '3:1', aspectRatio: 3, icon: null },
    { name: 'Avatar', ratio: '1:1', aspectRatio: 1, icon: null },
    { name: 'Cover', ratio: '16:6', aspectRatio: 16 / 6, icon: null },
    { name: 'Polaroid', ratio: '1:1.2', aspectRatio: 1 / 1.2, icon: null },
    { name: 'Postcard', ratio: '3:2', aspectRatio: 3 / 2, icon: null },
    { name: 'Poster', ratio: '2:3', aspectRatio: 2 / 3, icon: null },
    { name: 'Thumbnail', ratio: '16:9', aspectRatio: 16 / 9, icon: null }
  ];

  const applyPresetCrop = (preset: any) => {
    let newWidth, newHeight;

    // Calculate crop dimensions based on image size, not fixed values
    if (preset.aspectRatio >= 1) {
      // Landscape or square
      newWidth = Math.min(dimensions.display.width * 0.8, dimensions.display.height * 0.8 * preset.aspectRatio);
      newHeight = newWidth / preset.aspectRatio;
    } else {
      // Portrait
      newHeight = Math.min(dimensions.display.height * 0.8, dimensions.display.width * 0.8 / preset.aspectRatio);
      newWidth = newHeight * preset.aspectRatio;
    }

    // Center the crop
    const newX = (dimensions.display.width - newWidth) / 2;
    const newY = (dimensions.display.height - newHeight) / 2;

    dispatch(setPreviewCrop({
      x: Math.round(newX),
      y: Math.round(newY),
      width: Math.round(newWidth),
      height: Math.round(newHeight)
    }));

    if (!active) {
      dispatch(setActive(true));
    }
  };


  return (
    <div className="bg-slate-800 rounded-lg p-6 mb-14">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-300">Crop & Resize</h3>
        <button
          onClick={handleReset}
          className="p-2 text-gray-500 hover:text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
          title="Reset crop"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-6">
        <button
          onClick={handleToggleActive}
          className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 mb-3 ${active
            ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
          <Crop className="w-4 h-4 mr-2" />
          {active ? 'Crop Mode Active' : 'Enable Crop Mode'}
        </button>

        {/* Apply/Cancel buttons - only show when crop is active */}
        {active && (
          <div className="flex gap-2">
            <button
              onClick={handleApplyCrop}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Check className="w-4 h-4 mr-2" />
              Apply Crop
            </button>
            <button
              onClick={handleCancelCrop}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
          </div>
        )}

        {active && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            Adjust crop area • Click Apply to confirm changes
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">X Position</label>
          <input
            type="number"
            value={Math.round(preview.x)}
            onChange={(e) => handleCropChange('x', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!active}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Y Position</label>
          <input
            type="number"
            value={Math.round(preview.y)}
            onChange={(e) => handleCropChange('y', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!active}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Width</label>
          <input
            type="number"
            value={Math.round(preview.width)}
            onChange={(e) => handleCropChange('width', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!active}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Height</label>
          <input
            type="number"
            value={Math.round(preview.height)}
            onChange={(e) => handleCropChange('height', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!active}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center">
          <Maximize2 className="w-4 h-4 mr-2" />
          Preset Ratios
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {presetCrops.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPresetCrop(preset)}
              className="px-3 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-md transition-colors text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!active}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-200">{preset.name}</span>
                {preset.icon && <preset.icon className="w-3 h-3 text-gray-400" />}
              </div>
              <span className="block text-xs text-gray-400 group-hover:text-gray-300">
                {preset.ratio}
              </span>
            </button>
          ))}
        </div>
      </div>

      {(active || isApplied) && (
        <div className="mt-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
          <div className="text-xs text-gray-400">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>Preview: {Math.round(preview.width)} × {Math.round(preview.height)}</div>
              <div>Ratio: {preview.width > 0 && preview.height > 0 ? (preview.width / preview.height).toFixed(2) : '0'}</div>
            </div>
            {isApplied && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-600">
                <div>Applied: {Math.round(applied.width)} × {Math.round(applied.height)}</div>
                <div className="text-green-400">✓ Crop Applied</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedCropPanel;
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setAngle, rotate90, rotate180, flipHorizontal, flipVertical, resetRotation } from '../../store/slices/rotationSlice';
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical } from 'lucide-react';
import { useCloudinary } from '../../hooks/useCloudinary';

const RotationPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { angle, flipHorizontal: isFlippedH, flipVertical: isFlippedV } = useSelector((state: RootState) => state.rotation);
  const { saveToHistory } = useCloudinary();

  const handleRotationChange = (action: any) => {
    dispatch(action);
    saveToHistory(); // Save to history after each change
  };

  return (
    <div className="bg-slate-800 md:rounded-lg p-3 md:p-6 pb-[124px]">
      <div className="flex justify-between items-center mb-3 md:mb-4">
        <h3 className="text-sm md:text-lg font-semibold text-gray-200">Rotate & Flip</h3>
        <button
          onClick={() => dispatch(resetRotation())}
          className="p-1.5 md:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Reset rotation"
        >
          <RotateCcw className="w-3 h-3 md:w-4 md:h-4" />
        </button>
      </div>

      <div className="mb-3 md:mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="text-xs md:text-sm font-medium text-gray-400">Angle</label>
          <span className="text-xs md:text-sm text-gray-500">{angle}°</span>
        </div>
        <input
          type="range"
          min={0}
          max={360}
          step={1}
          value={angle}
          onChange={(e) => dispatch(setAngle(parseInt(e.target.value)))}
          className="w-full h-1.5 md:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
        <button
          onClick={() => dispatch(rotate90())}
          className="flex items-center justify-center px-2 md:px-4 py-1.5 md:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs md:text-sm"
        >
          <RotateCw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          90°
        </button>
        <button
          onClick={() => dispatch(rotate180())}
          className="flex items-center justify-center px-2 md:px-4 py-1.5 md:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs md:text-sm"
        >
          <RotateCw className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          180°
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-3">
        <button
          onClick={() => handleRotationChange(flipHorizontal())}
          className={`flex items-center justify-center px-2 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-colors text-xs md:text-sm ${
            isFlippedH 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FlipHorizontal className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Flip </span>H
        </button>
        <button
          onClick={() => handleRotationChange(flipVertical())}
          className={`flex items-center justify-center px-2 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-colors text-xs md:text-sm ${
            isFlippedV 
              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FlipVertical className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Flip </span>V
        </button>
      </div>
    </div>
  );
};

export default RotationPanel;
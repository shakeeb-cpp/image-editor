import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import {
  setGrayscale, setSepia, setBlur, setVignette, resetFilters,
  setColorize,
  setBlackAndWhite,
  setRedEye,
  setNegate,
  setOilPaint,
  setSimulateColorBlind,
  setPixelate
} from '../../store/slices/filterSlice';
import { RotateCcw, Palette, Loader2 } from 'lucide-react';

const FilterPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { grayscale, sepia, blur, vignette,
    colorize,
    blackAndWhite,
    redEye,
    negate,
    oilPaint,
    simulateColorBlind,
    pixelate } = useSelector((state: RootState) => state.filter);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentFilter, setCurrentFilter] = useState<string>('');

  // Simulate filter processing with progress
  const simulateFilterProcessing = useCallback((filterName: string, callback: () => void) => {
    setIsLoading(true);
    setLoadingProgress(0);
    setCurrentFilter(filterName);

    // Simulate processing time with progress updates
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          // Complete the filter application
          setTimeout(() => {
            callback();
            setIsLoading(false);
            setLoadingProgress(0);
            setCurrentFilter('');
          }, 200);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 50);
  }, []);

  const handleFilterToggle = (filterName: string, action: () => void) => {
    simulateFilterProcessing(filterName, action);
  };

  const handleSliderChange = (filterName: string, action: () => void) => {
    // For sliders, we can use a shorter debounced approach
    if (isLoading) return;
    
    setIsLoading(true);
    setCurrentFilter(filterName);
    setLoadingProgress(0);
    
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 80) {
          clearInterval(progressInterval);
          setTimeout(() => {
            action();
            setIsLoading(false);
            setLoadingProgress(0);
            setCurrentFilter('');
          }, 100);
          return 100;
        }
        return prev + 20;
      });
    }, 25);
  };

  const handleReset = () => {
    simulateFilterProcessing('Resetting filters', () => {
      dispatch(resetFilters());
    });
  };

  const ToggleButton = ({
    label,
    active,
    onClick,
    icon: Icon
  }: {
    label: string;
    active: boolean;
    onClick: () => void;
    icon?: React.ElementType;
  }) => (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors relative ${
        active
          ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
          : 'bg-slate-700 text-gray-200 hover:bg-slate-600'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {label}
      {isLoading && currentFilter === label && (
        <Loader2 className="w-4 h-4 ml-2 animate-spin" />
      )}
    </button>
  );

  const LoadingProgressBar = () => {
    if (!isLoading) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-slate-800 rounded-lg p-6 w-80 mx-4">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500 mr-2" />
            <span className="text-gray-200 font-medium">Applying {currentFilter}...</span>
          </div>
          
          <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          
          <div className="text-center text-sm text-gray-400">
            {Math.round(loadingProgress)}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-slate-800 rounded-lg p-6 overflow-y-auto pb-44">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-200">Filters</h3>
          <button
            onClick={handleReset}
            disabled={isLoading}
            className={`p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title="Reset filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <ToggleButton
            label="Grayscale"
            active={grayscale}
            onClick={() => handleFilterToggle('Grayscale', () => dispatch(setGrayscale(!grayscale)))}
            icon={Palette}
          />
          <ToggleButton
            label="Sepia"
            active={sepia}
            onClick={() => handleFilterToggle('Sepia', () => dispatch(setSepia(!sepia)))}
            icon={Palette}
          />
          <ToggleButton
            label="Vignette"
            active={vignette}
            onClick={() => handleFilterToggle('Vignette', () => dispatch(setVignette(!vignette)))}
            icon={Palette}
          />
          <ToggleButton
            label="Black & White"
            active={blackAndWhite}
            onClick={() => handleFilterToggle('Black & White', () => dispatch(setBlackAndWhite(!blackAndWhite)))}
            icon={Palette}
          />
          <ToggleButton
            label="Red Eye"
            active={redEye}
            onClick={() => handleFilterToggle('Red Eye', () => dispatch(setRedEye(!redEye)))}
            icon={Palette}
          />
          <ToggleButton
            label="Negate"
            active={negate}
            onClick={() => handleFilterToggle('Negate', () => dispatch(setNegate(!negate)))}
            icon={Palette}
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-400">Blur</label>
            <span className="text-sm text-gray-400">{blur}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={blur}
            disabled={isLoading}
            onChange={(e) => handleSliderChange('Blur', () => dispatch(setBlur(parseInt(e.target.value))))}
            className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-400">Colorize</label>
            <span className="text-sm text-gray-400">{colorize}</span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            step={1}
            value={colorize}
            disabled={isLoading}
            onChange={(e) => handleSliderChange('Colorize', () => dispatch(setColorize(parseInt(e.target.value))))}
            className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-400">Oil Paint</label>
            <span className="text-sm text-gray-400">{oilPaint}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={oilPaint}
            disabled={isLoading}
            onChange={(e) => handleSliderChange('Oil Paint', () => dispatch(setOilPaint(parseInt(e.target.value))))}
            className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-400">Pixelate</label>
            <span className="text-sm text-gray-400">{pixelate}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={pixelate}
            disabled={isLoading}
            onChange={(e) => handleSliderChange('Pixelate', () => dispatch(setPixelate(parseInt(e.target.value))))}
            className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-400 mb-2 block">Color Blind Simulation</label>
          <select
            value={simulateColorBlind}
            disabled={isLoading}
            onChange={(e) => handleSliderChange('Color Blind Simulation', () => dispatch(setSimulateColorBlind(e.target.value)))}
            className={`w-full px-3 py-2 bg-slate-700 text-gray-200 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <option value="none">None</option>
            <option value="deuteranopia">Deuteranopia</option>
            <option value="protanopia">Protanopia</option>
            <option value="tritanopia">Tritanopia</option>
          </select>
        </div>
      </div>

      <LoadingProgressBar />
    </>
  );
};

export default FilterPanel;
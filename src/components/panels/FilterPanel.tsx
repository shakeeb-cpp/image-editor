import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { 
  setGrayscale, setSepia, setBlur, setVignette, setColorize, 
  setBlackAndWhite, setRedEye, setNegate, setOilPaint, 
  setSimulateColorBlind, setPixelate, resetFilters 
} from '../../store/slices/filterSlice';
import { Palette, RotateCcw, ChevronDown } from 'lucide-react';

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

  // Instant filter application - no artificial delays
  const handleFilterToggle = useCallback((action: () => void) => {
    action();
  }, []);

  const handleSliderChange = useCallback((action: () => void) => {
    action();
  }, []);

  const handleReset = useCallback(() => {
    dispatch(resetFilters());
  }, [dispatch]);

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
      className={`flex items-center justify-center px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${active
        ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
        : 'bg-slate-700 text-gray-200 hover:bg-slate-600'
        }`}
    >
      {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />}
      {label}
    </button>
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <div className="bg-slate-800 md:rounded-lg p-4 sm:p-6 overflow-y-auto pb-[130px] md:pb-48 relative">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-md md:text-lg font-semibold text-gray-200">Filters</h3>
          <button
            onClick={handleReset}
            className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset filters"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
          <ToggleButton
            label="Grayscale"
            active={grayscale}
            onClick={() => handleFilterToggle(() => dispatch(setGrayscale(!grayscale)))}
            icon={Palette}
          />
          <ToggleButton
            label="Sepia"
            active={sepia}
            onClick={() => handleFilterToggle(() => dispatch(setSepia(!sepia)))}
            icon={Palette}
          />
          <ToggleButton
            label="Vignette"
            active={vignette}
            onClick={() => handleFilterToggle(() => dispatch(setVignette(!vignette)))}
            icon={Palette}
          />
          <ToggleButton
            label="Black & White"
            active={blackAndWhite}
            onClick={() => handleFilterToggle(() => dispatch(setBlackAndWhite(!blackAndWhite)))}
            icon={Palette}
          />
          <ToggleButton
            label="Red Eye"
            active={redEye}
            onClick={() => handleFilterToggle(() => dispatch(setRedEye(!redEye)))}
            icon={Palette}
          />
          <ToggleButton
            label="Negate"
            active={negate}
            onClick={() => handleFilterToggle(() => dispatch(setNegate(!negate)))}
            icon={Palette}
          />
        </div>

        <div className="mb-3 sm:mb-4">
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <label className="text-xs sm:text-sm font-medium text-gray-400">Blur</label>
            <span className="text-xs sm:text-sm text-gray-400">{blur}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={blur}
            onChange={(e) => handleSliderChange(() => dispatch(setBlur(parseInt(e.target.value))))}
            className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div className="mb-3 sm:mb-4">
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <label className="text-xs sm:text-sm font-medium text-gray-400">Colorize</label>
            <span className="text-xs sm:text-sm text-gray-400">{colorize}</span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            step={1}
            value={colorize}
            onChange={(e) => handleSliderChange(() => dispatch(setColorize(parseInt(e.target.value))))}
            className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div className="mb-3 sm:mb-4">
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <label className="text-xs sm:text-sm font-medium text-gray-400">Oil Paint</label>
            <span className="text-xs sm:text-sm text-gray-400">{oilPaint}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={oilPaint}
            onChange={(e) => handleSliderChange(() => dispatch(setOilPaint(parseInt(e.target.value))))}
            className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div className="mb-3 sm:mb-4">
          <div className="flex justify-between items-center mb-1 sm:mb-2">
            <label className="text-xs sm:text-sm font-medium text-gray-400">Pixelate</label>
            <span className="text-xs sm:text-sm text-gray-400">{pixelate}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={pixelate}
            onChange={(e) => handleSliderChange(() => dispatch(setPixelate(parseInt(e.target.value))))}
            className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
        {/* Custom dropdown for color blind simulation */}
        <div className="mb-3 sm:mb-4 relative">
          <label className="text-xs sm:text-sm font-medium text-gray-400 mb-1 sm:mb-2 block">Color Blind Simulation</label>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-700 text-gray-200 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none flex justify-between items-center"
            >
              <span>{simulateColorBlind === 'none' ? 'None' : 
                simulateColorBlind === 'deuteranopia' ? 'Deuteranopia' : 
                simulateColorBlind === 'protanopia' ? 'Protanopia' : 'Tritanopia'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-lg">
                {['none', 'deuteranopia', 'protanopia', 'tritanopia'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      dispatch(setSimulateColorBlind(option));
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs sm:text-sm hover:bg-slate-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
                  >
                    {option === 'none' ? 'None' : 
                      option === 'deuteranopia' ? 'Deuteranopia' : 
                      option === 'protanopia' ? 'Protanopia' : 'Tritanopia'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;


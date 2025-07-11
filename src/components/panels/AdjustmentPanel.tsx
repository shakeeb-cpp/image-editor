import React, { useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { 
  setBrightness, 
  setContrast, 
  setSaturation, 
  resetAdjustments, 
  setHue, 
  setSharpness, 
  setUnsharpMask, 
  setVignette,  
  setHighlight 
} from '../../store/slices/adjustmentSlice';
import { RotateCcw } from 'lucide-react';
import { useCloudinary } from '../../hooks/useCloudinary';

// Debounce utility function
const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  
  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};



interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

const SliderControl: React.FC<SliderControlProps> = React.memo(({
  label,
  value,
  onChange,
  min = -100,
  max = 100,
  step = 1
}) => {
  const localValueRef = useRef(value);
  const sliderRef = useRef<HTMLInputElement>(null);
  const { saveToHistory } = useCloudinary(); // Add this
  
  // Immediate onChange for instant feedback (no throttling for state updates)
  const immediateOnChange = useCallback((newValue: number) => {
    onChange(newValue);
  }, [onChange]);

  // Debounce only for history saving
  const debouncedHistorySave = useDebounce(() => {
    saveToHistory();
  }, 500);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    localValueRef.current = newValue;

    // Update state immediately for instant visual feedback
    immediateOnChange(newValue);

    // Save to history after user stops adjusting
    debouncedHistorySave();
  }, [immediateOnChange, debouncedHistorySave]);
  
  const handleSliderClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    const slider = e.currentTarget;
    const rect = slider.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newValue = Math.round(min + (max - min) * percent);
    
    localValueRef.current = newValue;
    slider.value = newValue.toString();
    onChange(newValue);
  }, [min, max, onChange]);
  
  // Update local ref when value changes from outside
  React.useEffect(() => {
    localValueRef.current = value;
    if (sliderRef.current) {
      sliderRef.current.value = value.toString();
    }
  }, [value]);
  
  return (
    <div className="mb-3 sm:mb-4">
      <div className="flex justify-between items-center mb-1 sm:mb-2">
        <label className="text-xs sm:text-sm font-medium text-gray-400">{label}</label>
        <span className="text-xs sm:text-sm text-gray-500">{value}</span>
      </div>
      <input
        ref={sliderRef}
        type="range"
        min={min}
        max={max}
        step={step}
        defaultValue={value}
        onChange={handleSliderChange}
        onClick={handleSliderClick}
        className="w-full h-1.5 sm:h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
        }}
      />
    </div>
  );
});

SliderControl.displayName = 'SliderControl';

const AdjustmentPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const adjustments = useSelector((state: RootState) => state.adjustment);
  
  // Memoize slider configurations
  const sliderConfigs = useMemo(() => [
    {
      label: 'Brightness',
      value: adjustments.brightness,
      onChange: (value: number) => dispatch(setBrightness(value)),
      min: -100,
      max: 100
    },
    {
      label: 'Contrast',
      value: adjustments.contrast,
      onChange: (value: number) => dispatch(setContrast(value)),
      min: -100,
      max: 100
    },
    {
      label: 'Saturation',
      value: adjustments.saturation,
      onChange: (value: number) => dispatch(setSaturation(value)),
      min: -100,
      max: 100
    },
    {
      label: 'Hue',
      value: adjustments.hue,
      onChange: (value: number) => dispatch(setHue(value)),
      min: -180,
      max: 180
    },
    {
      label: 'Sharpness',
      value: adjustments.sharpness,
      onChange: (value: number) => dispatch(setSharpness(value)),
      min: 0,
      max: 100
    },
    {
      label: 'Unsharp Mask',
      value: adjustments.unsharpMask,
      onChange: (value: number) => dispatch(setUnsharpMask(value)),
      min: 0,
      max: 500
    },
    {
      label: 'Vignette',
      value: adjustments.vignette,
      onChange: (value: number) => dispatch(setVignette(value)),
      min: 0,
      max: 100
    },
    {
      label: 'Highlight',
      value: adjustments.highlight,
      onChange: (value: number) => dispatch(setHighlight(value)),
      min: -100,
      max: 100
    }
  ], [dispatch, adjustments]);
  
  const handleReset = useCallback(() => {
    dispatch(resetAdjustments());
  }, [dispatch]);
  
  return (
    <div className="bg-slate-800 md:rounded-lg p-4 sm:p-6 pb-3 md:mb-20">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-md md:text-lg font-semibold text-gray-300">Adjustments</h3>
        <button
          onClick={handleReset}
          className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
          title="Reset adjustments"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {sliderConfigs.map((config) => (
        <SliderControl
          key={config.label}
          label={config.label}
          value={config.value}
          onChange={config.onChange}
          min={config.min}
          max={config.max}
        />
      ))}
    </div>
  );
};

export default AdjustmentPanel;
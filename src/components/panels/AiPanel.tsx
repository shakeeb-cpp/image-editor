import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import {
  setGenerativeRecolor,
  setGenerativeRecolorPrompt,
  setGenerativeRecolorColor,
  setGenerativeRecolorDetectMultiple,
  setGenerativeRecolorProcessing,
  setGenerativeRecolorProgress,
  setGenerativeRestore,
  setGenerativeRestoreProcessing,
  setGenerativeRestoreProgress,
  setUpscale,
  setUpscaleProcessing,
  setUpscaleProgress,
  setEnhance,
  setEnhanceProcessing,
  setEnhanceProgress,
  setExtract,
  setExtractPrompt,
  setExtractMode,
  setExtractProcessing,
  setExtractProgress,
  resetAiEffects,
} from '../../store/slices/aiSlice';
import { 
  Sparkles,  
  RotateCcw, 
  Loader2,
  Palette,
  RefreshCw,
  TrendingUp,
  Star,
  Target
} from 'lucide-react';
import { useCloudinary } from '../../hooks/useCloudinary';
import ProgressBar from '../ui/ProgressBar';

const AiPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const aiState = useSelector((state: RootState) => state.ai);
  const { saveToHistory } = useCloudinary();

  // Progress simulation function
  const simulateProgress = (
    setProcessing: (value: boolean) => any,
    setProgress: (value: number) => any,
    duration: number = 3000
  ) => {
    dispatch(setProcessing(true));
    dispatch(setProgress(0));

    const steps = 20;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = (currentStep / steps) * 100;
      dispatch(setProgress(progress));

      if (currentStep >= steps) {
        clearInterval(interval);
        dispatch(setProcessing(false));
        dispatch(setProgress(0));
      }
    }, stepDuration);
  };

  const handleGenerativeRecolor = () => {
    const newEnabled = !aiState.generativeRecolor.enabled;
    dispatch(setGenerativeRecolor(newEnabled));

    if (newEnabled && aiState.generativeRecolor.prompt) {
      simulateProgress(setGenerativeRecolorProcessing, setGenerativeRecolorProgress, 4000);
    }

    saveToHistory();
  };

  const handleGenerativeRestore = () => {
    const newEnabled = !aiState.generativeRestore.enabled;
    dispatch(setGenerativeRestore(newEnabled));

    if (newEnabled) {
      simulateProgress(setGenerativeRestoreProcessing, setGenerativeRestoreProgress, 5000);
    }

    saveToHistory();
  };

  const handleUpscale = () => {
    const newEnabled = !aiState.upscale.enabled;
    dispatch(setUpscale(newEnabled));

    if (newEnabled) {
      simulateProgress(setUpscaleProcessing, setUpscaleProgress, 6000);
    }

    saveToHistory();
  };

  const handleEnhance = () => {
    const newEnabled = !aiState.enhance.enabled;
    dispatch(setEnhance(newEnabled));

    if (newEnabled) {
      simulateProgress(setEnhanceProcessing, setEnhanceProgress, 3500);
    }

    saveToHistory();
  };

  const handleExtract = () => {
    const newEnabled = !aiState.extract.enabled;
    dispatch(setExtract(newEnabled));

    if (newEnabled && aiState.extract.prompt) {
      simulateProgress(setExtractProcessing, setExtractProgress, 4500);
    }

    saveToHistory();
  };

  const handleReset = () => {
    dispatch(resetAiEffects());
    saveToHistory();
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 mb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-md sm:text-xl font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          AI Effects
        </h2>
        <button
          onClick={handleReset}
          className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          title="Reset all AI effects"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Global Progress Bar */}
      <ProgressBar
        progress={aiState.overallProgress}
        isVisible={aiState.isAnyProcessing}
        label="Processing AI Effects..."
        color="purple"
        size="md"
      />

      {/* Generative Recolor */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1.5 sm:gap-2">
            <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Generative Recolor
          </label>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {aiState.generativeRecolor.isProcessing && (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-500 animate-spin" />
            )}
            <button
              onClick={handleGenerativeRecolor}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                aiState.generativeRecolor.enabled
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {aiState.generativeRecolor.enabled ? 'Enabled' : 'Enable'}
            </button>
          </div>
        </div>
        
        <div className="flex  gap-1.5 sm:gap-2 w-full">
          <input
            type="text"
            value={aiState.generativeRecolor.prompt}
            onChange={(e) => dispatch(setGenerativeRecolorPrompt(e.target.value))}
            placeholder="Object to recolor (e.g., 'dog', 'item')"
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-800 border border-slate-600 rounded-lg text-white w-full text-xs sm:text-sm focus:outline-none focus:border-purple-500"
          />
          <input
            type="color"
            value={aiState.generativeRecolor.color}
            onChange={(e) => dispatch(setGenerativeRecolorColor(e.target.value))}
            className="px-1 py-1.5 sm:py-2 bg-slate-800 border border-slate-600 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>
        
        <label className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-300">
          <input
            type="checkbox"
            checked={aiState.generativeRecolor.detectMultiple}
            onChange={(e) => dispatch(setGenerativeRecolorDetectMultiple(e.target.checked))}
            className="rounded border-slate-600 bg-slate-800 text-purple-600 focus:ring-purple-500"
          />
          Detect multiple instances
        </label>
        
        <ProgressBar
          progress={aiState.generativeRecolor.progress}
          isVisible={aiState.generativeRecolor.isProcessing}
          color="purple"
          size="sm"
        />
        
        <p className="text-xs text-gray-400">
          Change the color of specific objects in your image using AI
        </p>
      </div>

      {/* Generative Restore */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1.5 sm:gap-2">
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Generative Restore
          </label>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {aiState.generativeRestore.isProcessing && (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 animate-spin" />
            )}
            <button
              onClick={handleGenerativeRestore}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                aiState.generativeRestore.enabled
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {aiState.generativeRestore.enabled ? 'Enabled' : 'Enable'}
            </button>
          </div>
        </div>
        
        <ProgressBar
          progress={aiState.generativeRestore.progress}
          isVisible={aiState.generativeRestore.isProcessing}
          color="green"
          size="sm"
        />
        
        <p className="text-xs text-gray-400">
          Restore and repair damaged or old images using AI
        </p>
      </div>

      {/* Upscale */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1.5 sm:gap-2">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Upscale
          </label>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {aiState.upscale.isProcessing && (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 animate-spin" />
            )}
            <button
              onClick={handleUpscale}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                aiState.upscale.enabled
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {aiState.upscale.enabled ? 'Enabled' : 'Enable'}
            </button>
          </div>
        </div>
        
        <ProgressBar
          progress={aiState.upscale.progress}
          isVisible={aiState.upscale.isProcessing}
          color="blue"
          size="sm"
        />
        
        <p className="text-xs text-gray-400">
          Increase image resolution while maintaining quality
        </p>
      </div>

      {/* Enhance */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1.5 sm:gap-2">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Enhance
          </label>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {aiState.enhance.isProcessing && (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 animate-spin" />
            )}
            <button
              onClick={handleEnhance}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                aiState.enhance.enabled
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {aiState.enhance.enabled ? 'Enabled' : 'Enable'}
            </button>
          </div>
        </div>
        
        <ProgressBar
          progress={aiState.enhance.progress}
          isVisible={aiState.enhance.isProcessing}
          color="orange"
          size="sm"
        />
        
        <p className="text-xs text-gray-400">
          Automatically enhance image quality and details
        </p>
      </div>

      {/* Extract */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1.5 sm:gap-2">
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Extract
          </label>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {aiState.extract.isProcessing && (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-500 animate-spin" />
            )}
            <button
              onClick={handleExtract}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                aiState.extract.enabled
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {aiState.extract.enabled ? 'Enabled' : 'Enable'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          <input
            type="text"
            value={aiState.extract.prompt}
            onChange={(e) => dispatch(setExtractPrompt(e.target.value))}
            placeholder="Object to extract (e.g., 'dog')"
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
          />
          <select
            value={aiState.extract.mode}
            onChange={(e) => dispatch(setExtractMode(e.target.value as 'content' | 'mask'))}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="content">Content</option>
            <option value="mask">Mask</option>
          </select>
        </div>
        
        <ProgressBar
          progress={aiState.extract.progress}
          isVisible={aiState.extract.isProcessing}
          color="purple"
          size="sm"
        />
        
        <p className="text-xs text-gray-400">
          Extract specific objects from your image using AI
        </p>
      </div>

      {/* Overall Processing Status */}
      {aiState.isAnyProcessing && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
          <div className="flex items-center gap-1.5 sm:gap-2 text-purple-400">
            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
            <span className="text-xs sm:text-sm font-medium">Processing AI effects...</span>
          </div>
          <p className="text-xs text-purple-300 mt-1">
            AI processing may take several moments to complete.
          </p>
        </div>
      )}
    </div>
  );
};

export default AiPanel;
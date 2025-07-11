import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import {
  setBackgroundRemoval,
  setBackgroundRemovalProcessing,
  setGenerativeRemove,
  setGenerativeRemovePrompt,
  setGenerativeRemoveProcessing,
  setGenerativeReplace,
  setGenerativeReplaceFrom,
  setGenerativeReplaceTo,
  setGenerativeReplaceProcessing,
  setGenerativeBackgroundReplace,
  setGenerativeBackgroundReplacePrompt,
  setGenerativeBackgroundReplaceProcessing,
  resetBgEffects,
} from '../../store/slices/bgSlice';
import { Eraser, Wand2, Replace, Image, RotateCcw, Loader2 } from 'lucide-react';
import { useCloudinary } from '../../hooks/useCloudinary';

// Progress Bar Component
const ProgressBar: React.FC<{ progress: number; label: string }> = ({ progress, label }) => {
  return (
    <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
      <div 
        className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      ></div>
      <p className="text-xs sm:text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
};

const BgPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const bgState = useSelector((state: RootState) => state.bg);
  const { saveToHistory } = useCloudinary();

  // Progress state for each operation
  const [progress, setProgress] = useState({
    backgroundRemoval: 0,
    generativeRemove: 0,
    generativeReplace: 0,
    generativeBackgroundReplace: 0,
  });

  // Simulate progress for background removal
  useEffect(() => {
    if (bgState.backgroundRemoval.isProcessing) {
      const interval = setInterval(() => {
        setProgress(prev => ({
          ...prev,
          backgroundRemoval: Math.min(prev.backgroundRemoval + Math.random() * 15, 95)
        }));
      }, 500);

      return () => clearInterval(interval);
    } else {
      setProgress(prev => ({ ...prev, backgroundRemoval: 0 }));
    }
  }, [bgState.backgroundRemoval.isProcessing]);

  // Simulate progress for generative remove
  useEffect(() => {
    if (bgState.generativeRemove.isProcessing) {
      const interval = setInterval(() => {
        setProgress(prev => ({
          ...prev,
          generativeRemove: Math.min(prev.generativeRemove + Math.random() * 12, 95)
        }));
      }, 600);

      return () => clearInterval(interval);
    } else {
      setProgress(prev => ({ ...prev, generativeRemove: 0 }));
    }
  }, [bgState.generativeRemove.isProcessing]);

  // Simulate progress for generative replace
  useEffect(() => {
    if (bgState.generativeReplace.isProcessing) {
      const interval = setInterval(() => {
        setProgress(prev => ({
          ...prev,
          generativeReplace: Math.min(prev.generativeReplace + Math.random() * 10, 95)
        }));
      }, 700);

      return () => clearInterval(interval);
    } else {
      setProgress(prev => ({ ...prev, generativeReplace: 0 }));
    }
  }, [bgState.generativeReplace.isProcessing]);

  // Simulate progress for background replace
  useEffect(() => {
    if (bgState.generativeBackgroundReplace.isProcessing) {
      const interval = setInterval(() => {
        setProgress(prev => ({
          ...prev,
          generativeBackgroundReplace: Math.min(prev.generativeBackgroundReplace + Math.random() * 8, 95)
        }));
      }, 800);

      return () => clearInterval(interval);
    } else {
      setProgress(prev => ({ ...prev, generativeBackgroundReplace: 0 }));
    }
  }, [bgState.generativeBackgroundReplace.isProcessing]);

  const handleBackgroundRemoval = async () => {
    const newState = !bgState.backgroundRemoval.enabled;
    dispatch(setBackgroundRemoval(newState));
    
    if (newState) {
      dispatch(setBackgroundRemovalProcessing(true));
      
      // Simulate API call
      try {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
        setProgress(prev => ({ ...prev, backgroundRemoval: 100 }));
        setTimeout(() => {
          dispatch(setBackgroundRemovalProcessing(false));
          saveToHistory();
        }, 500);
      } catch (error) {
        dispatch(setBackgroundRemovalProcessing(false));
        console.error('Background removal failed:', error);
      }
    } else {
      saveToHistory();
    }
  };

  const handleGenerativeRemove = async () => {
    const newState = !bgState.generativeRemove.enabled;
    dispatch(setGenerativeRemove(newState));
    
    if (newState && bgState.generativeRemove.prompt.trim()) {
      dispatch(setGenerativeRemoveProcessing(true));
      
      try {
        await new Promise(resolve => setTimeout(resolve, 4000)); // 4 second delay
        setProgress(prev => ({ ...prev, generativeRemove: 100 }));
        setTimeout(() => {
          dispatch(setGenerativeRemoveProcessing(false));
          saveToHistory();
        }, 500);
      } catch (error) {
        dispatch(setGenerativeRemoveProcessing(false));
        console.error('Generative remove failed:', error);
      }
    } else {
      saveToHistory();
    }
  };

  const handleGenerativeReplace = async () => {
    const newState = !bgState.generativeReplace.enabled;
    dispatch(setGenerativeReplace(newState));
    
    if (newState && bgState.generativeReplace.from.trim() && bgState.generativeReplace.to.trim()) {
      dispatch(setGenerativeReplaceProcessing(true));
      
      try {
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay
        setProgress(prev => ({ ...prev, generativeReplace: 100 }));
        setTimeout(() => {
          dispatch(setGenerativeReplaceProcessing(false));
          saveToHistory();
        }, 500);
      } catch (error) {
        dispatch(setGenerativeReplaceProcessing(false));
        console.error('Generative replace failed:', error);
      }
    } else {
      saveToHistory();
    }
  };

  const handleGenerativeBackgroundReplace = async () => {
    const newState = !bgState.generativeBackgroundReplace.enabled;
    dispatch(setGenerativeBackgroundReplace(newState));
    
    if (newState && bgState.generativeBackgroundReplace.prompt.trim()) {
      dispatch(setGenerativeBackgroundReplaceProcessing(true));
      
      try {
        await new Promise(resolve => setTimeout(resolve, 6000)); // 6 second delay
        setProgress(prev => ({ ...prev, generativeBackgroundReplace: 100 }));
        setTimeout(() => {
          dispatch(setGenerativeBackgroundReplaceProcessing(false));
          saveToHistory();
        }, 500);
      } catch (error) {
        dispatch(setGenerativeBackgroundReplaceProcessing(false));
        console.error('Background replace failed:', error);
      }
    } else {
      saveToHistory();
    }
  };

  const handleReset = () => {
    dispatch(resetBgEffects());
    setProgress({
      backgroundRemoval: 0,
      generativeRemove: 0,
      generativeReplace: 0,
      generativeBackgroundReplace: 0,
    });
    saveToHistory();
  };

  const isAnyProcessing = bgState.backgroundRemoval.isProcessing || 
    bgState.generativeRemove.isProcessing || 
    bgState.generativeReplace.isProcessing || 
    bgState.generativeBackgroundReplace.isProcessing;

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-md md:text-xl font-semibold text-white flex items-center gap-2">
          <Image className="w-4 h-4 sm:w-5 sm:h-5" />
          Background Effects
        </h2>
        <button
          onClick={handleReset}
          disabled={isAnyProcessing}
          className={`p-1.5 sm:p-2 rounded-lg transition-colors ${
            isAnyProcessing 
              ? 'text-gray-500 cursor-not-allowed' 
              : 'text-gray-400 hover:text-white hover:bg-slate-700'
          }`}
          title="Reset all background effects"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Background Removal */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1.5 sm:gap-2">
            <Eraser className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Background Removal
          </label>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {bgState.backgroundRemoval.isProcessing && (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 animate-spin" />
            )}
            <button
              onClick={handleBackgroundRemoval}
              disabled={isAnyProcessing && !bgState.backgroundRemoval.isProcessing}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                bgState.backgroundRemoval.enabled
                  ? 'bg-blue-600 text-white'
                  : isAnyProcessing && !bgState.backgroundRemoval.isProcessing
                  ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {bgState.backgroundRemoval.enabled ? 'Enabled' : 'Enable'}
            </button>
          </div>
        </div>
        
        {bgState.backgroundRemoval.isProcessing && (
          <ProgressBar 
            progress={progress.backgroundRemoval} 
            label={``}
          />
        )}
        
        <p className="text-xs text-gray-400">
          Automatically remove the background from your image
        </p>
      </div>

      {/* Generative Remove */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1.5 sm:gap-2">
            <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Generative Remove
          </label>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {bgState.generativeRemove.isProcessing && (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 animate-spin" />
            )}
            <button
              onClick={handleGenerativeRemove}
              disabled={isAnyProcessing && !bgState.generativeRemove.isProcessing}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                bgState.generativeRemove.enabled
                  ? 'bg-blue-600 text-white'
                  : isAnyProcessing && !bgState.generativeRemove.isProcessing
                  ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {bgState.generativeRemove.enabled ? 'Enabled' : 'Enable'}
            </button>
          </div>
        </div>
        
        <input
          type="text"
          value={bgState.generativeRemove.prompt}
          onChange={(e) => dispatch(setGenerativeRemovePrompt(e.target.value))}
          placeholder="Enter what to remove (e.g., 'dog')"
          disabled={isAnyProcessing}
          className={`w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 ${
            isAnyProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
        
        {bgState.generativeRemove.isProcessing && (
          <ProgressBar 
            progress={progress.generativeRemove} 
            label={``}
          />
        )}
        
        <p className="text-xs text-gray-400">
          Remove specific objects from your image using AI
        </p>
      </div>

      {/* Generative Replace */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1.5 sm:gap-2">
            <Replace className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Generative Replace
          </label>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {bgState.generativeReplace.isProcessing && (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 animate-spin" />
            )}
            <button
              onClick={handleGenerativeReplace}
              disabled={isAnyProcessing && !bgState.generativeReplace.isProcessing}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                bgState.generativeReplace.enabled
                  ? 'bg-blue-600 text-white'
                  : isAnyProcessing && !bgState.generativeReplace.isProcessing
                  ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {bgState.generativeReplace.enabled ? 'Enabled' : 'Enable'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          <input
            type="text"
            value={bgState.generativeReplace.from}
            onChange={(e) => dispatch(setGenerativeReplaceFrom(e.target.value))}
            placeholder="Replace this (e.g., 'dog')"
            disabled={isAnyProcessing}
            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 ${
              isAnyProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <input
            type="text"
            value={bgState.generativeReplace.to}
            onChange={(e) => dispatch(setGenerativeReplaceTo(e.target.value))}
            placeholder="With this (e.g., 'cat')"
            disabled={isAnyProcessing}
            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 ${
              isAnyProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>
        
        {bgState.generativeReplace.isProcessing && (
          <ProgressBar 
            progress={progress.generativeReplace} 
            label={``}
          />
        )}
        
        <p className="text-xs text-gray-400">
          Replace objects in your image with something else using AI
        </p>
      </div>

      {/* Generative Background Replace */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-medium text-gray-300 flex items-center gap-1.5 sm:gap-2">
            <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Background Replace
          </label>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {bgState.generativeBackgroundReplace.isProcessing && (
              <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 animate-spin" />
            )}
            <button
              onClick={handleGenerativeBackgroundReplace}
              disabled={isAnyProcessing && !bgState.generativeBackgroundReplace.isProcessing}
              className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                bgState.generativeBackgroundReplace.enabled
                  ? 'bg-blue-600 text-white'
                  : isAnyProcessing && !bgState.generativeBackgroundReplace.isProcessing
                  ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {bgState.generativeBackgroundReplace.enabled ? 'Enabled' : 'Enable'}
            </button>
          </div>
        </div>
        
        <input
          type="text"
          value={bgState.generativeBackgroundReplace.prompt}
          onChange={(e) => dispatch(setGenerativeBackgroundReplacePrompt(e.target.value))}
          placeholder="New background (e.g., 'a buildings')"
          disabled={isAnyProcessing}
          className={`w-full px-2.5 sm:px-3 py-1.5 sm:py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 ${
            isAnyProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
        
        {bgState.generativeBackgroundReplace.isProcessing && (
          <ProgressBar 
            progress={progress.generativeBackgroundReplace} 
            label={``}
          />
        )}
        
        <p className="text-xs text-gray-400">
          Replace the background with a new AI-generated scene
        </p>
      </div>

      {/* Overall Processing Status */}
      {isAnyProcessing && (
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center gap-1.5 sm:gap-2 text-blue-400">
            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
            <span className="text-xs sm:text-sm font-medium">Processing background effects...</span>
          </div>
          <p className="text-xs text-blue-300 mt-1">
            Please wait while we apply the changes to your image.
          </p>
        </div>
      )}
    </div>
  );
};

export default BgPanel;
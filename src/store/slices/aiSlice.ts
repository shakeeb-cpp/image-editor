import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AiState {
  // Generative recolor
  generativeRecolor: {
    enabled: boolean;
    prompt: string;
    color: string;
    detectMultiple: boolean;
    isProcessing: boolean;
    progress: number;
  };
  
  // Generative restore
  generativeRestore: {
    enabled: boolean;
    isProcessing: boolean;
    progress: number;
  };
  
  // Upscale
  upscale: {
    enabled: boolean;
    isProcessing: boolean;
    progress: number;
  };
  
  // Enhance
  enhance: {
    enabled: boolean;
    isProcessing: boolean;
    progress: number;
  };
  
  // Extract
  extract: {
    enabled: boolean;
    prompt: string;
    mode: 'content' | 'mask';
    isProcessing: boolean;
    progress: number;
  };
  
  // Global processing state
  isAnyProcessing: boolean;
  overallProgress: number;
}

const initialState: AiState = {
  generativeRecolor: {
    enabled: false,
    prompt: '',
    color: '#EB4444',
    detectMultiple: false,
    isProcessing: false,
    progress: 0,
  },
  generativeRestore: {
    enabled: false,
    isProcessing: false,
    progress: 0,
  },
  upscale: {
    enabled: false,
    isProcessing: false,
    progress: 0,
  },
  enhance: {
    enabled: false,
    isProcessing: false,
    progress: 0,
  },
  extract: {
    enabled: false,
    prompt: '',
    mode: 'content',
    isProcessing: false,
    progress: 0,
  },
  isAnyProcessing: false,
  overallProgress: 0,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    // Generative recolor actions
    setGenerativeRecolor: (state, action: PayloadAction<boolean>) => {
      state.generativeRecolor.enabled = action.payload;
    },
    setGenerativeRecolorPrompt: (state, action: PayloadAction<string>) => {
      state.generativeRecolor.prompt = action.payload;
    },
    setGenerativeRecolorColor: (state, action: PayloadAction<string>) => {
      state.generativeRecolor.color = action.payload;
    },
    setGenerativeRecolorDetectMultiple: (state, action: PayloadAction<boolean>) => {
      state.generativeRecolor.detectMultiple = action.payload;
    },
    setGenerativeRecolorProcessing: (state, action: PayloadAction<boolean>) => {
      state.generativeRecolor.isProcessing = action.payload;
      state.isAnyProcessing = action.payload || state.generativeRestore.isProcessing || 
                             state.upscale.isProcessing || state.enhance.isProcessing || 
                             state.extract.isProcessing;
    },
    setGenerativeRecolorProgress: (state, action: PayloadAction<number>) => {
      state.generativeRecolor.progress = action.payload;
    },
    
    // Generative restore actions
    setGenerativeRestore: (state, action: PayloadAction<boolean>) => {
      state.generativeRestore.enabled = action.payload;
    },
    setGenerativeRestoreProcessing: (state, action: PayloadAction<boolean>) => {
      state.generativeRestore.isProcessing = action.payload;
      state.isAnyProcessing = state.generativeRecolor.isProcessing || action.payload || 
                             state.upscale.isProcessing || state.enhance.isProcessing || 
                             state.extract.isProcessing;
    },
    setGenerativeRestoreProgress: (state, action: PayloadAction<number>) => {
      state.generativeRestore.progress = action.payload;
    },
    
    // Upscale actions
    setUpscale: (state, action: PayloadAction<boolean>) => {
      state.upscale.enabled = action.payload;
    },
    setUpscaleProcessing: (state, action: PayloadAction<boolean>) => {
      state.upscale.isProcessing = action.payload;
      state.isAnyProcessing = state.generativeRecolor.isProcessing || state.generativeRestore.isProcessing || 
                             action.payload || state.enhance.isProcessing || 
                             state.extract.isProcessing;
    },
    setUpscaleProgress: (state, action: PayloadAction<number>) => {
      state.upscale.progress = action.payload;
    },
    
    // Enhance actions
    setEnhance: (state, action: PayloadAction<boolean>) => {
      state.enhance.enabled = action.payload;
    },
    setEnhanceProcessing: (state, action: PayloadAction<boolean>) => {
      state.enhance.isProcessing = action.payload;
      state.isAnyProcessing = state.generativeRecolor.isProcessing || state.generativeRestore.isProcessing || 
                             state.upscale.isProcessing || action.payload || 
                             state.extract.isProcessing;
    },
    setEnhanceProgress: (state, action: PayloadAction<number>) => {
      state.enhance.progress = action.payload;
    },
    
    // Extract actions
    setExtract: (state, action: PayloadAction<boolean>) => {
      state.extract.enabled = action.payload;
    },
    setExtractPrompt: (state, action: PayloadAction<string>) => {
      state.extract.prompt = action.payload;
    },
    setExtractMode: (state, action: PayloadAction<'content' | 'mask'>) => {
      state.extract.mode = action.payload;
    },
    setExtractProcessing: (state, action: PayloadAction<boolean>) => {
      state.extract.isProcessing = action.payload;
      state.isAnyProcessing = state.generativeRecolor.isProcessing || state.generativeRestore.isProcessing || 
                             state.upscale.isProcessing || state.enhance.isProcessing || 
                             action.payload;
    },
    setExtractProgress: (state, action: PayloadAction<number>) => {
      state.extract.progress = action.payload;
    },
    
    // Global progress actions
    setOverallProgress: (state, action: PayloadAction<number>) => {
      state.overallProgress = action.payload;
    },
    
    // Reset all AI effects
    resetAiEffects: () => {
      return initialState;
    },
    
    // Set AI state (for history functionality)
    setAiState: (state, action: PayloadAction<AiState>) => {
      console.log(state)
      return action.payload;
    },
  },
});

export const {
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
  setOverallProgress,
  resetAiEffects,
  setAiState,
} = aiSlice.actions;

export default aiSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BgState {
  // Background removal
  backgroundRemoval: {
    enabled: boolean;
    isProcessing: boolean;
  };
  
  // Generative remove
  generativeRemove: {
    enabled: boolean;
    prompt: string;
    isProcessing: boolean;
  };
  
  // Generative replace
  generativeReplace: {
    enabled: boolean;
    from: string;
    to: string;
    isProcessing: boolean;
  };
  
  // Generative background replace
  generativeBackgroundReplace: {
    enabled: boolean;
    prompt: string;
    isProcessing: boolean;
  };
}

const initialState: BgState = {
  backgroundRemoval: {
    enabled: false,
    isProcessing: false,
  },
  generativeRemove: {
    enabled: false,
    prompt: '',
    isProcessing: false,
  },
  generativeReplace: {
    enabled: false,
    from: '',
    to: '',
    isProcessing: false,
  },
  generativeBackgroundReplace: {
    enabled: false,
    prompt: '',
    isProcessing: false,
  },
};

const bgSlice = createSlice({
  name: 'bg',
  initialState,
  reducers: {
    // Background removal actions
    setBackgroundRemoval: (state, action: PayloadAction<boolean>) => {
      state.backgroundRemoval.enabled = action.payload;
    },
    setBackgroundRemovalProcessing: (state, action: PayloadAction<boolean>) => {
      state.backgroundRemoval.isProcessing = action.payload;
    },
    
    // Generative remove actions
    setGenerativeRemove: (state, action: PayloadAction<boolean>) => {
      state.generativeRemove.enabled = action.payload;
    },
    setGenerativeRemovePrompt: (state, action: PayloadAction<string>) => {
      state.generativeRemove.prompt = action.payload;
    },
    setGenerativeRemoveProcessing: (state, action: PayloadAction<boolean>) => {
      state.generativeRemove.isProcessing = action.payload;
    },
    
    // Generative replace actions
    setGenerativeReplace: (state, action: PayloadAction<boolean>) => {
      state.generativeReplace.enabled = action.payload;
    },
    setGenerativeReplaceFrom: (state, action: PayloadAction<string>) => {
      state.generativeReplace.from = action.payload;
    },
    setGenerativeReplaceTo: (state, action: PayloadAction<string>) => {
      state.generativeReplace.to = action.payload;
    },
    setGenerativeReplaceProcessing: (state, action: PayloadAction<boolean>) => {
      state.generativeReplace.isProcessing = action.payload;
    },
    
    // Generative background replace actions
    setGenerativeBackgroundReplace: (state, action: PayloadAction<boolean>) => {
      state.generativeBackgroundReplace.enabled = action.payload;
    },
    setGenerativeBackgroundReplacePrompt: (state, action: PayloadAction<string>) => {
      state.generativeBackgroundReplace.prompt = action.payload;
    },
    setGenerativeBackgroundReplaceProcessing: (state, action: PayloadAction<boolean>) => {
      state.generativeBackgroundReplace.isProcessing = action.payload;
    },
    
    // Reset all background effects
    resetBgEffects: () => {
      return initialState;
    },
    
    // Set background state (for history functionality)
    setBgState: (state, action: PayloadAction<BgState>) => {
      console.log(state)
      return action.payload;
    },
  },
});

export const {
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
  setBgState,
} = bgSlice.actions;

export default bgSlice.reducer;

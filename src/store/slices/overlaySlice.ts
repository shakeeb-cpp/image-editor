import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OverlayState, TextOverlay, ImageOverlay } from '../../types';

const initialState: OverlayState = {
  textOverlays: [],
  imageOverlays: [],
};

const overlaySlice = createSlice({
  name: 'overlay',
  initialState,
  reducers: {
    addTextOverlay: (state, action: PayloadAction<TextOverlay>) => {
      state.textOverlays.push(action.payload);
    },
    updateTextOverlay: (state, action: PayloadAction<TextOverlay>) => {
      const index = state.textOverlays.findIndex(overlay => overlay.id === action.payload.id);
      if (index !== -1) {
        state.textOverlays[index] = action.payload;
      }
    },
    removeTextOverlay: (state, action: PayloadAction<string>) => {
      state.textOverlays = state.textOverlays.filter(overlay => overlay.id !== action.payload);
    },
    addImageOverlay: (state, action: PayloadAction<ImageOverlay>) => {
      state.imageOverlays.push(action.payload);
    },
    updateImageOverlay: (state, action: PayloadAction<ImageOverlay>) => {
      const index = state.imageOverlays.findIndex(overlay => overlay.id === action.payload.id);
      if (index !== -1) {
        state.imageOverlays[index] = action.payload;
      }
    },
    removeImageOverlay: (state, action: PayloadAction<string>) => {
      state.imageOverlays = state.imageOverlays.filter(overlay => overlay.id !== action.payload);
    },
    resetOverlays: (state) => {
      state.textOverlays = [];
      state.imageOverlays = [];
    },
    setState: (state, action: PayloadAction<OverlayState>) => {
      return action.payload;
    }
  },
});

export const {
  addTextOverlay,
  updateTextOverlay,
  removeTextOverlay,
  addImageOverlay,
  updateImageOverlay,
  removeImageOverlay,
  resetOverlays,
  setState,
} = overlaySlice.actions;
export default overlaySlice.reducer;


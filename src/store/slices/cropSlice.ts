import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CropState {
  // Preview crop (what user is selecting)
  preview: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  // Applied crop (what actually gets applied to image)
  applied: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  active: boolean; // Whether crop mode is active
  isApplied: boolean; // Whether crop has been applied
}

const initialState: CropState = {
  preview: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  applied: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  },
  active: false,
  isApplied: false,
};

const cropSlice = createSlice({
  name: "crop",
  initialState,
  reducers: {
    // Set preview crop (what user is selecting)
    setPreviewCrop: (
      state,
      action: PayloadAction<{
        x: number;
        y: number;
        width: number;
        height: number;
      }>
    ) => {
      state.preview = action.payload;
    },

    // Apply the current preview crop to the image
    // Apply the current preview crop to the image
    applyCrop: (state) => {
      // Only apply if there's actually a change
      if (
        state.preview.x !== state.applied.x ||
        state.preview.y !== state.applied.y ||
        state.preview.width !== state.applied.width ||
        state.preview.height !== state.applied.height
      ) {
        state.applied = { ...state.preview };
        state.isApplied = true;
      }
    },

    // Toggle crop mode
    setActive: (state, action: PayloadAction<boolean>) => {
      state.active = action.payload;
      if (!action.payload) {
        // If disabling crop mode, reset preview
        state.preview = { x: 0, y: 0, width: 0, height: 0 };
      }
    },

    // Reset everything
    resetCrop: (state) => {
      state.preview = { x: 0, y: 0, width: 0, height: 0 };
      state.applied = { x: 0, y: 0, width: 0, height: 0 };
      state.active = false;
      state.isApplied = false;
    },

    // Cancel current preview (revert to applied state)
    cancelCrop: (state) => {
      state.preview = { ...state.applied };
      state.active = false;
    },
  },
});

export const { setPreviewCrop, applyCrop, setActive, resetCrop, cancelCrop } =
  cropSlice.actions;

export default cropSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdjustmentState } from "../../types";

const initialState: AdjustmentState = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  hue: 0,
  sharpness: 0,
  unsharpMask: 0,
  vignette: 0,
  ambiance: 0,
  highlight: 0,
};

const adjustmentSlice = createSlice({
  name: "adjustment",
  initialState,
  reducers: {
    setBrightness: (state, action: PayloadAction<number>) => {
      state.brightness = action.payload;
    },
    setContrast: (state, action: PayloadAction<number>) => {
      state.contrast = action.payload;
    },
    setSaturation: (state, action: PayloadAction<number>) => {
      state.saturation = action.payload;
    },
    setExposure: (state, action: PayloadAction<number>) => {
      state.exposure = action.payload;
    },
    setHue: (state, action: PayloadAction<number>) => {
      state.hue = action.payload;
    },
    setSharpness: (state, action: PayloadAction<number>) => {
      state.sharpness = action.payload;
    },
    setUnsharpMask: (state, action: PayloadAction<number>) => {
      state.unsharpMask = action.payload;
    },
    setVignette: (state, action: PayloadAction<number>) => {
      state.vignette = action.payload;
    },
    setAmbiance: (state, action: PayloadAction<number>) => {
      state.ambiance = action.payload;
    },
    setHighlight: (state, action: PayloadAction<number>) => {
      state.highlight = action.payload;
    },
    resetAdjustments: (state) => {
      Object.assign(state, initialState);
    },
    setState: (state, action: PayloadAction<AdjustmentState>) => {
      return action.payload;
    }
  },
});

export const {
  setBrightness,
  setContrast,
  setSaturation,
  setExposure,
  setHue,
  setSharpness,
  setUnsharpMask,
  setVignette,
  setAmbiance,
  setHighlight,
  resetAdjustments,
  setState,
} = adjustmentSlice.actions;
export default adjustmentSlice.reducer;



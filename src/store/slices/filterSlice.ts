import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterState } from "../../types";

const initialState: FilterState = {
  grayscale: false,
  sepia: false,
  blur: 0,
  vignette: false,
  colorize: 0,
  blackAndWhite: false,
  redEye: false,
  negate: false,
  oilPaint: 0,
  simulateColorBlind: "none",
  pixelate: 0,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setGrayscale: (state, action: PayloadAction<boolean>) => {
      state.grayscale = action.payload;
    },
    setSepia: (state, action: PayloadAction<boolean>) => {
      state.sepia = action.payload;
    },
    setBlur: (state, action: PayloadAction<number>) => {
      state.blur = action.payload;
    },
    setVignette: (state, action: PayloadAction<boolean>) => {
      state.vignette = action.payload;
    },
    setColorize: (state, action: PayloadAction<number>) => {
      state.colorize = action.payload;
    },
    setBlackAndWhite: (state, action: PayloadAction<boolean>) => {
      state.blackAndWhite = action.payload;
    },
    setRedEye: (state, action: PayloadAction<boolean>) => {
      state.redEye = action.payload;
    },
    setNegate: (state, action: PayloadAction<boolean>) => {
      state.negate = action.payload;
    },
    setOilPaint: (state, action: PayloadAction<number>) => {
      state.oilPaint = action.payload;
    },
    setSimulateColorBlind: (state, action: PayloadAction<string>) => {
      state.simulateColorBlind = action.payload;
    },
    setPixelate: (state, action: PayloadAction<number>) => {
      state.pixelate = action.payload;
    },
    resetFilters: (state) => {
      state.grayscale = false;
      state.sepia = false;
      state.blur = 0;
      state.vignette = false;
      state.colorize = 0;
      state.blackAndWhite = false;
      state.redEye = false;
      state.negate = false;
      state.oilPaint = 0;
      state.simulateColorBlind = "none";
      state.pixelate = 0;
    },
    setState: (state, action: PayloadAction<FilterState>) => {
      console.log(state)
      return action.payload;
    }
  },
});

export const {
  setGrayscale,
  setSepia,
  setBlur,
  setVignette,
  resetFilters,
  setColorize,
  setBlackAndWhite,
  setRedEye,
  setNegate,
  setOilPaint,
  setSimulateColorBlind,
  setPixelate,
  setState,
} = filterSlice.actions;
export default filterSlice.reducer;



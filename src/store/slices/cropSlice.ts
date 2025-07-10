import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CropState } from '../../types';

const initialState: CropState = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  active: false,
  position: null, // Add position state - null means no position selected
};

const cropSlice = createSlice({
  name: 'crop',
  initialState,
  reducers: {
    setCrop: (state, action: PayloadAction<{ x: number; y: number; width: number; height: number }>) => {
      state.x = action.payload.x;
      state.y = action.payload.y;
      state.width = action.payload.width;
      state.height = action.payload.height;
    },
    setActive: (state, action: PayloadAction<boolean>) => {
      state.active = action.payload;
    },
    setPosition: (state, action: PayloadAction<'top' | 'center' | 'bottom'>) => {
      state.position = action.payload;
    },
    resetCrop: (state) => {
      state.x = 0;
      state.y = 0;
      state.width = 0;
      state.height = 0;
      state.active = false;
      state.position = null;
    },
  },
});

export const { setCrop, setActive, setPosition, resetCrop } = cropSlice.actions;
export default cropSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RotationState } from '../../types';

const initialState: RotationState = {
  angle: 0,
  flipHorizontal: false,
  flipVertical: false,
};

const rotationSlice = createSlice({
  name: 'rotation',
  initialState,
  reducers: {
    setAngle: (state, action: PayloadAction<number>) => {
      state.angle = action.payload;
    },
    rotate90: (state) => {
      state.angle = (state.angle + 90) % 360;
    },
    rotate180: (state) => {
      state.angle = (state.angle + 180) % 360;
    },
    flipHorizontal: (state) => {
      state.flipHorizontal = !state.flipHorizontal;
    },
    flipVertical: (state) => {
      state.flipVertical = !state.flipVertical;
    },
    resetRotation: (state) => {
      state.angle = 0;
      state.flipHorizontal = false;
      state.flipVertical = false;
    },
    setRotationState: (state, action: PayloadAction<any>) => {
      return action.payload;
    },
  },
});

export const { setAngle, rotate90, rotate180, flipHorizontal, flipVertical, resetRotation, setRotationState } = rotationSlice.actions;
export default rotationSlice.reducer;

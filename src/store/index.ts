import { configureStore } from '@reduxjs/toolkit';
import imageReducer from './slices/imageSlice';
import adjustmentReducer from './slices/adjustmentSlice';
import cropReducer from './slices/cropSlice';
import rotationReducer from './slices/rotationSlice';
import filterReducer from './slices/filterSlice';
import overlayReducer from './slices/overlaySlice';
import historyReducer from './slices/historySlice';
import bgReducer from './slices/bgSlice';
import aiReducer from './slices/aiSlice';

export const store = configureStore({
  reducer: {
    image: imageReducer,
    adjustment: adjustmentReducer,
    crop: cropReducer,
    rotation: rotationReducer,
    filter: filterReducer,
    overlay: overlayReducer,
    history: historyReducer,
    bg: bgReducer,
    ai: aiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ImageState } from '../../types';

const initialState: ImageState = {
  publicId: null,
  originalUrl: null,
  transformedUrl: null,
  isUploading: false,
  error: null,
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },
    setImage: (state, action: PayloadAction<{ publicId: string; originalUrl: string }>) => {
      state.publicId = action.payload.publicId;
      state.originalUrl = action.payload.originalUrl;
      state.transformedUrl = action.payload.originalUrl;
      state.error = null;
    },
    setTransformedUrl: (state, action: PayloadAction<string>) => {
      state.transformedUrl = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isUploading = false;
    },
    clearImage: (state) => {
      state.publicId = null;
      state.originalUrl = null;
      state.transformedUrl = null;
      state.error = null;
    },
  },
});

export const { setUploading, setImage, setTransformedUrl, setError, clearImage } = imageSlice.actions;
export default imageSlice.reducer;
import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { setImage, setIsUploading, setUploadProgress } from '../store/slices/imageSlice';
import { uploadImage } from '../utils/cloudinary';

const UploadArea: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isUploading, uploadProgress } = useAppSelector(state => state.image);
  const [dragOver, setDragOver] = useState(false);
  
  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    try {
      dispatch(setIsUploading(true));
      dispatch(setUploadProgress(0));
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        dispatch(setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        }));
      }, 100);
      
      const result = await uploadImage(file);
      
      clearInterval(progressInterval);
      dispatch(setUploadProgress(100));
      
      dispatch(setImage({
        publicId: result.publicId,
        originalUrl: result.url
      }));
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      dispatch(setIsUploading(false));
      dispatch(setUploadProgress(0));
    }
  }, [dispatch]);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);
  
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);
  
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div
        className={`w-full max-w-2xl border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          dragOver
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-600 hover:border-slate-500'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <Upload className="w-8 h-8 text-white" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-white">Upload an image to get started</h2>
            <p className="text-slate-400">Drag & drop your image here, or click to browse</p>
          </div>
          
          {isUploading ? (
            <div className="space-y-2">
              <div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-slate-400">Uploading... {uploadProgress}%</p>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors">
                <ImageIcon className="w-4 h-4" />
                <span>Choose Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
              
              <p className="text-sm text-slate-500">
                Supports JPG, PNG, GIF up to 10MB • Powered by ImageCraft
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadArea;
import React, { useRef } from 'react';
import { Upload, Camera, Cloud } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useCloudinary } from '../hooks/useCloudinary';
import { setUploading, setImage, setError } from '../store/slices/imageSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const ImageUpload: React.FC = () => {
  const dispatch = useAppDispatch();
  const { uploadImage } = useCloudinary();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isUploading, error } = useSelector((state: RootState) => state.image);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      dispatch(setError('Please select a valid image file'));
      return;
    }

    dispatch(setUploading(true));
    try {
      const { publicId, url } = await uploadImage(file);
      dispatch(setImage({ publicId, originalUrl: url }));
    } catch (err) {
      dispatch(setError('Failed to upload image. Please try again.'));
    } finally {
      dispatch(setUploading(false));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="w-full ">
      <div
        className="border-2 border-dashed border-slate-500 rounded-lg p-8 text-center hover:border-slate-700 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500"></div>
            <p className="mt-4 text-gray-300">Uploading image...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center relative mb-4">
              {isUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              ) : (
                <>
                  <Cloud className="w-6 h-6 absolute -top-1 -right-1 text-blue-300" />
                  <Upload className="w-8 h-8 text-white" />
                </>
              )}
            </div>
            {/* <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Upload className="w-8 h-8 text-blue-500" />
            </div> */}
            <h3 className="text-lg font-semibold text-gray-200 mb-2">Upload an Image to get started</h3>
            <p className="text-slate-400 mb-4">
              Drag and drop an image here, or click to select a file
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 flex items-center">
              <Camera className="w-4 h-4 mr-2" />
              Choose Image
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
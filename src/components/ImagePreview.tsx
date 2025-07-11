import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setTransformedUrl } from '../store/slices/imageSlice';
import { useOptimizedCloudinary } from '../hooks/useOptimizedCloudinary';
// import ActionBar from './ActionBar';

const ImagePreview: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transformedUrl, publicId } = useSelector((state: RootState) => state.image);
  const { buildTransformedUrl } = useOptimizedCloudinary();

  // Local state for instant preview
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Instant preview effect - updates immediately
  useEffect(() => {
    if (!publicId) {
      setPreviewUrl('');
      return;
    }

    // Clear any pending timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Build URL immediately for instant preview
    const newUrl = buildTransformedUrl();
    if (newUrl) {
      setPreviewUrl(newUrl);
      setIsLoading(true);

      // Update the store URL after a short delay to avoid too many updates
      updateTimeoutRef.current = setTimeout(() => {
        dispatch(setTransformedUrl(newUrl));
        setIsLoading(false);
      }, 100);
    }

    // Cleanup timeout on unmount
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [publicId, buildTransformedUrl, dispatch]);


  // Use preview URL for instant feedback, fallback to transformed URL
  const displayUrl = previewUrl || transformedUrl;

  if (!displayUrl) {
    return (
      <div className="md:w-full md:max-w-4xl md:h-96 h-[200px] bg-gray-800/50 rounded-xl border border-gray-700 flex items-center justify-center backdrop-blur-sm">
        <p className="text-gray-400 text-lg">No image loaded</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl h-full max-h-[600px] md:p-4 p-2">
      <div className="w-full h-full md:bg-gray-800/30 rounded-xl md:border border-gray-700 md:backdrop-blur-sm md:shadow-2xl overflow-hidden relative">
        {isLoading && (
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-slate-900 opacity-0 rounded-full px-3 py-1 flex items-center space-x-2">
              <span className="text-xs text-slate-300"></span>
            </div>
          </div>
        )}
        <div className="w-full h-full md:py-4 md:px-4 py-2 px-0 flex items-center justify-center">
          <img
            src={displayUrl}
            alt="Preview"
            className="max-w-full  md:max-h-full max-h-full object-contain rounded-lg md:shadow-lg transition-all duration-150 md:hover:shadow-xl"
            style={{
              filter: 'md:drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))',
            }}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
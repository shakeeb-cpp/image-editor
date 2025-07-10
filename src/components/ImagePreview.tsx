import React, { useEffect} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setTransformedUrl } from '../store/slices/imageSlice';
import { useCloudinary } from '../hooks/useCloudinary';
// import ActionBar from './ActionBar';

const ImagePreview: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transformedUrl, publicId } = useSelector((state: RootState) => state.image);
  const { x, y, width, height, active } = useSelector((state: RootState) => state.crop);
  const adjustmentState = useSelector((state: RootState) => state.adjustment);
  const rotationState = useSelector((state: RootState) => state.rotation);
  const filterState = useSelector((state: RootState) => state.filter);
  const overlayState = useSelector((state: RootState) => state.overlay);
  const bgState = useSelector((state: RootState) => state.bg);
  const aiState = useSelector((state: RootState) => state.ai);
  const { buildTransformedUrl } = useCloudinary();

  useEffect(() => {
    if (publicId) {
      const newUrl = buildTransformedUrl();
      if (newUrl) {
        dispatch(setTransformedUrl(newUrl));
      }
    }
  }, [
    publicId,
    x, y, width, height, active,
    adjustmentState,
    rotationState,
    filterState,
    overlayState,
    bgState,
    aiState,
    buildTransformedUrl,
    dispatch
  ]);


  if (!transformedUrl) {
    return (
      <div className="w-full max-w-4xl h-96 bg-gray-800/50 rounded-xl border border-gray-700 flex items-center justify-center backdrop-blur-sm">
        <p className="text-gray-400 text-lg">No image loaded</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl h-full max-h-[600px] p-4">
      <div className="w-full h-full bg-gray-800/30 rounded-xl border border-gray-700 backdrop-blur-sm shadow-2xl overflow-hidden">
        <div className="w-full h-full p-4 flex items-center justify-center">
          <img
            src={transformedUrl}
            alt="Preview"
            className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
            style={{ 
              filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
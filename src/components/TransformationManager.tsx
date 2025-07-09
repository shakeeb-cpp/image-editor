import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setTransformedUrl } from '../store/slices/imageSlice';
import { useCloudinary } from '../hooks/useCloudinary';

/**
 * TransformationManager component that watches for changes in all transformation states
 * and updates the transformed URL accordingly. This ensures that adjustments, filters,
 * rotation, and overlays are applied immediately when changed.
 */
const TransformationManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const { publicId, transformedUrl } = useSelector((state: RootState) => state.image);
  const adjustmentState = useSelector((state: RootState) => state.adjustment);
  const filterState = useSelector((state: RootState) => state.filter);
  const rotationState = useSelector((state: RootState) => state.rotation);
  const overlayState = useSelector((state: RootState) => state.overlay);
  const cropState = useSelector((state: RootState) => state.crop);
  const { buildTransformedUrl } = useCloudinary();

  // Use ref to track the last generated URL to prevent infinite loops
  const lastGeneratedUrl = useRef<string>('');
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced update function to prevent rapid successive updates
  const debouncedUpdate = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = setTimeout(() => {
      if (publicId) {
        const newUrl = buildTransformedUrl();
        // Only update if the URL actually changed and it's different from what we last generated
        if (newUrl && newUrl !== lastGeneratedUrl.current && newUrl !== transformedUrl) {
          lastGeneratedUrl.current = newUrl;
          dispatch(setTransformedUrl(newUrl));
        }
      }
    }, 50); // 50ms debounce
  }, [publicId, buildTransformedUrl, transformedUrl, dispatch]);

  // Update transformed URL whenever any transformation state changes
  useEffect(() => {
    debouncedUpdate();

    // Cleanup timeout on unmount
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [
    // Include all transformation states in dependencies so debouncedUpdate is called when they change
    adjustmentState.brightness,
    adjustmentState.contrast,
    adjustmentState.saturation,
    adjustmentState.exposure,
    adjustmentState.hue,
    adjustmentState.sharpness,
    adjustmentState.unsharpMask,
    adjustmentState.vignette,
    adjustmentState.ambiance,
    adjustmentState.highlight,
    filterState.grayscale,
    filterState.sepia,
    filterState.blur,
    filterState.vignette,
    filterState.colorize,
    filterState.blackAndWhite,
    filterState.redEye,
    filterState.negate,
    filterState.oilPaint,
    filterState.simulateColorBlind,
    filterState.pixelate,
    rotationState.angle,
    rotationState.flipHorizontal,
    rotationState.flipVertical,
    overlayState.textOverlays,
    overlayState.imageOverlays,
    cropState.applied,
    cropState.isApplied,
    debouncedUpdate
  ]);

  // This component doesn't render anything, it just manages transformations
  return null;
};

export default TransformationManager;

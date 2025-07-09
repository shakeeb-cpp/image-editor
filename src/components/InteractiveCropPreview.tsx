import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { setDimensions } from '../store/slices/imageSlice';
import { setPreviewCrop } from '../store/slices/cropSlice';

interface CropBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface DragState {
    isDragging: boolean;
    isResizing: boolean;
    dragStart: { x: number; y: number };
    initialCrop: CropBox;
    resizeHandle: string;
}

const InteractiveCropPreview: React.FC = () => {
    const dispatch = useAppDispatch();
    const { transformedUrl } = useSelector((state: RootState) => state.image);
    const cropState = useSelector((state: RootState) => state.crop);

    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        isResizing: false,
        dragStart: { x: 0, y: 0 },
        initialCrop: { x: 0, y: 0, width: 0, height: 0 },
        resizeHandle: ''
    });



    // Handle image load
    const handleImageLoad = useCallback(() => {
        if (imageRef.current) {
            const img = imageRef.current;
            const displayWidth = img.offsetWidth;
            const displayHeight = img.offsetHeight;
            const originalWidth = img.naturalWidth;
            const originalHeight = img.naturalHeight;

            // Dispatch dimensions to Redux store
            dispatch(setDimensions({
                display: { width: displayWidth, height: displayHeight },
                original: { width: originalWidth, height: originalHeight }
            }));

            setImageDimensions({ width: displayWidth, height: displayHeight });
            setImageLoaded(true);

            // Initialize crop box if not set
            if (!cropState.active && cropState.preview.width === 0 && cropState.preview.height === 0) {
                const initialSize = Math.min(displayWidth, displayHeight) * 0.8;
                const initialX = (displayWidth - initialSize) / 2;
                const initialY = (displayHeight - initialSize) / 2;

                dispatch(setPreviewCrop({
                    x: initialX,
                    y: initialY,
                    width: initialSize,
                    height: initialSize
                }));
            }
        }
    }, [cropState, dispatch]);

    // Convert screen coordinates to image coordinates
    const screenToImageCoords = useCallback((screenX: number, screenY: number) => {
        if (!imageRef.current || !containerRef.current) return { x: 0, y: 0 };

        const rect = imageRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        console.log(containerRect)
        const x = screenX - rect.left;
        const y = screenY - rect.top;

        return { x, y };
    }, []);

    // Handle mouse down on crop box
    const handleMouseDown = useCallback((e: React.MouseEvent, handle?: string) => {
        e.preventDefault();
        e.stopPropagation();

        const { x, y } = screenToImageCoords(e.clientX, e.clientY);

        setDragState({
            isDragging: !handle,
            isResizing: !!handle,
            dragStart: { x, y },
            initialCrop: { ...cropState.preview },
            resizeHandle: handle || ''
        });
    }, [screenToImageCoords, cropState]);

    // Handle mouse move
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!dragState.isDragging && !dragState.isResizing) return;

        const { x, y } = screenToImageCoords(e.clientX, e.clientY);
        const deltaX = x - dragState.dragStart.x;
        const deltaY = y - dragState.dragStart.y;

        let newCrop = { ...dragState.initialCrop };

        if (dragState.isDragging) {
            // Moving the crop box
            newCrop.x = Math.max(0, Math.min(imageDimensions.width - newCrop.width, dragState.initialCrop.x + deltaX));
            newCrop.y = Math.max(0, Math.min(imageDimensions.height - newCrop.height, dragState.initialCrop.y + deltaY));
        } else if (dragState.isResizing) {
            // Resizing the crop box
            const handle = dragState.resizeHandle;

            if (handle.includes('n')) {
                const newY = Math.max(0, dragState.initialCrop.y + deltaY);
                const newHeight = dragState.initialCrop.height - (newY - dragState.initialCrop.y);
                if (newHeight > 20) {
                    newCrop.y = newY;
                    newCrop.height = newHeight;
                }
            }
            if (handle.includes('s')) {
                newCrop.height = Math.max(20, Math.min(imageDimensions.height - newCrop.y, dragState.initialCrop.height + deltaY));
            }
            if (handle.includes('w')) {
                const newX = Math.max(0, dragState.initialCrop.x + deltaX);
                const newWidth = dragState.initialCrop.width - (newX - dragState.initialCrop.x);
                if (newWidth > 20) {
                    newCrop.x = newX;
                    newCrop.width = newWidth;
                }
            }
            if (handle.includes('e')) {
                newCrop.width = Math.max(20, Math.min(imageDimensions.width - newCrop.x, dragState.initialCrop.width + deltaX));
            }
        }

        dispatch(setPreviewCrop(newCrop));
    }, [dragState, screenToImageCoords, imageDimensions, dispatch]);

    // Handle mouse up
    const handleMouseUp = useCallback(() => {
        setDragState({
            isDragging: false,
            isResizing: false,
            dragStart: { x: 0, y: 0 },
            initialCrop: { x: 0, y: 0, width: 0, height: 0 },
            resizeHandle: ''
        });
    }, []);

    // Add global mouse event listeners
    useEffect(() => {
        if (dragState.isDragging || dragState.isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [dragState, handleMouseMove, handleMouseUp]);

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
                    <div
                        ref={containerRef}
                        className="relative inline-block"
                        style={{ userSelect: 'none' }}
                    >
                        <img
                            ref={imageRef}
                            src={transformedUrl}
                            alt="Preview"
                            className="max-w-full h-[460px] object-cover rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                            style={{
                                filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))',
                            }}
                            onLoad={handleImageLoad}
                            draggable={false}
                        />

                        {/* Crop overlay */}
                        {cropState.active && imageLoaded && (
                            <div
                                className="absolute border-2 border-blue-500 bg-blue-500/10 cursor-move"
                                style={{
                                    left: `${cropState.preview.x}px`,
                                    top: `${cropState.preview.y}px`,
                                    width: `${cropState.preview.width}px`,
                                    height: `${cropState.preview.height}px`,
                                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                                }}
                                onMouseDown={(e) => handleMouseDown(e)}
                            >
                                {/* Resize handles */}
                                {['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se'].map((handle) => (
                                    <div
                                        key={handle}
                                        className="absolute w-3 h-3 bg-blue-500 border border-white cursor-pointer hover:bg-blue-600 transition-colors"
                                        style={{
                                            left: handle.includes('w') ? '-6px' : handle.includes('e') ? '100%' : '50%',
                                            top: handle.includes('n') ? '-6px' : handle.includes('s') ? '100%' : '50%',
                                            transform: `translate(${handle.includes('w') ? '0' : handle.includes('e') ? '-100%' : '-50%'}, ${handle.includes('n') ? '0' : handle.includes('s') ? '-100%' : '-50%'})`,
                                            cursor: `${handle}-resize`,
                                        }}
                                        onMouseDown={(e) => handleMouseDown(e, handle)}
                                    />
                                ))}

                                {/* Center guidelines */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute w-full h-px bg-blue-300/50 top-1/3" />
                                    <div className="absolute w-full h-px bg-blue-300/50 top-2/3" />
                                    <div className="absolute w-px h-full bg-blue-300/50 left-1/3" />
                                    <div className="absolute w-px h-full bg-blue-300/50 left-2/3" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InteractiveCropPreview;
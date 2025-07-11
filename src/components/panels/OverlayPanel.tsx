import React, { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addTextOverlay, removeTextOverlay, updateTextOverlay, resetOverlays } from '../../store/slices/overlaySlice';
import { Type, RotateCcw, Plus, X, Move } from 'lucide-react';

// Memoized overlay item component to prevent unnecessary re-renders
const OverlayItem = React.memo<{
  overlay: any;
  onUpdate: (id: string, updates: Partial<any>) => void;
  onUpdatePosition: (id: string, field: 'x' | 'y', value: number) => void;
  onRemove: (id: string) => void;
}>(({ overlay, onUpdate, onUpdatePosition, onRemove }) => {
  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(overlay.id, { text: e.target.value });
  }, [overlay.id, onUpdate]);

  const handleFontSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(overlay.id, { fontSize: parseInt(e.target.value) || 24 });
  }, [overlay.id, onUpdate]);

  const handleColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(overlay.id, { color: e.target.value });
  }, [overlay.id, onUpdate]);

  const handleXPositionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdatePosition(overlay.id, 'x', parseInt(e.target.value) || 0);
  }, [overlay.id, onUpdatePosition]);

  const handleYPositionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdatePosition(overlay.id, 'y', parseInt(e.target.value) || 0);
  }, [overlay.id, onUpdatePosition]);

  const handleRemove = useCallback(() => {
    onRemove(overlay.id);
  }, [overlay.id, onRemove]);

  return (
    <div className="p-3 md:p-3 sm:p-2 bg-slate-700 md:rounded-lg rounded-md border border-slate-600">
      <div className="flex items-center justify-between mb-3 md:mb-3 sm:mb-2">
        <div className="flex items-center flex-1 min-w-0">
          <Type className="w-4 h-4 md:w-4 md:h-4 sm:w-3 sm:h-3 text-gray-300 mr-2 md:mr-2 sm:mr-1 flex-shrink-0" />
          <span className="text-sm md:text-sm sm:text-xs text-gray-200 truncate font-medium" title={overlay.text}>
            {overlay.text}
          </span>
        </div>
        <button
          onClick={handleRemove}
          className="p-1 md:p-1 sm:p-0.5 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors flex-shrink-0 ml-2 md:ml-2 sm:ml-1"
          title="Remove text overlay"
        >
          <X className="w-4 h-4 md:w-4 md:h-4 sm:w-3 sm:h-3" />
        </button>
      </div>

      {/* Text Content */}
      <div className="mb-3 md:mb-3 sm:mb-2">
        <label className="block text-xs md:text-xs sm:text-xs font-medium text-gray-400 mb-1 md:mb-1 sm:mb-0.5">Text</label>
        <input
          type="text"
          value={overlay.text}
          onChange={handleTextChange}
          className="w-full px-2 py-1 md:px-2 md:py-1 sm:px-1.5 sm:py-0.5 bg-slate-600 border border-gray-500 rounded md:rounded sm:rounded-sm text-sm md:text-sm sm:text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Position Controls */}
      <div className="mb-3 md:mb-3 sm:mb-2">
        <label className="block text-xs md:text-xs sm:text-xs font-medium text-gray-400 mb-1 md:mb-1 sm:mb-0.5">
          <Move className="w-3 h-3 md:w-3 md:h-3 sm:w-2.5 sm:h-2.5 inline mr-1 md:mr-1 sm:mr-0.5" />
          Position
        </label>
        <div className="grid grid-cols-2 gap-2 md:gap-2 sm:gap-1">
          <div>
            <label className="block text-xs md:text-xs sm:text-xs text-gray-500 mb-1 md:mb-1 sm:mb-0.5">X</label>
            <input
              type="number"
              value={overlay.x}
              onChange={handleXPositionChange}
              min="-1000"
              max="1000"
              className="w-full px-2 py-1 md:px-2 md:py-1 sm:px-1.5 sm:py-0.5 bg-slate-600 border border-gray-500 rounded md:rounded sm:rounded-sm text-sm md:text-sm sm:text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs md:text-xs sm:text-xs text-gray-500 mb-1 md:mb-1 sm:mb-0.5">Y</label>
            <input
              type="number"
              value={overlay.y}
              onChange={handleYPositionChange}
              min="-1000"
              max="1000"
              className="w-full px-2 py-1 md:px-2 md:py-1 sm:px-1.5 sm:py-0.5 bg-slate-600 border border-gray-500 rounded md:rounded sm:rounded-sm text-sm md:text-sm sm:text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Style Controls */}
      <div className="grid grid-cols-2 gap-2 md:gap-2 sm:gap-1">
        <div>
          <label className="block text-xs md:text-xs sm:text-xs text-gray-500 mb-1 md:mb-1 sm:mb-0.5">Font Size</label>
          <input
            type="number"
            value={overlay.fontSize}
            onChange={handleFontSizeChange}
            min="10"
            max="100"
            className="w-full px-2 py-1 md:px-2 md:py-1 sm:px-1.5 sm:py-0.5 bg-slate-600 border border-gray-500 rounded md:rounded sm:rounded-sm text-sm md:text-sm sm:text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs md:text-xs sm:text-xs text-gray-500 mb-1 md:mb-1 sm:mb-0.5">Color</label>
          <input
            type="color"
            value={overlay.color}
            onChange={handleColorChange}
            className="w-full h-8 md:h-8 sm:h-6 bg-slate-600 border border-gray-500 rounded md:rounded sm:rounded-sm cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
});

OverlayItem.displayName = 'OverlayItem';

const OverlayPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { textOverlays } = useSelector((state: RootState) => state.overlay);
  const [newText, setNewText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(24);
  const [xPosition, setXPosition] = useState(50);
  const [yPosition, setYPosition] = useState(50);

  // Memoized handlers to prevent unnecessary re-renders
  const handleAddText = useCallback(() => {
    if (newText.trim()) {
      dispatch(addTextOverlay({
        id: Date.now().toString(),
        text: newText,
        x: xPosition,
        y: yPosition,
        fontSize,
        color: textColor,
        fontFamily: 'Arial',
      }));
      setNewText('');
      setXPosition(50);
      setYPosition(50);
    }
  }, [dispatch, newText, xPosition, yPosition, fontSize, textColor]);

  const handleUpdatePosition = useCallback((id: string, field: 'x' | 'y', value: number) => {
    const overlay = textOverlays.find(o => o.id === id);
    if (overlay) {
      dispatch(updateTextOverlay({
        ...overlay,
        [field]: value,
      }));
    }
  }, [dispatch, textOverlays]);

  const handleUpdateOverlay = useCallback((id: string, updates: Partial<any>) => {
    const overlay = textOverlays.find(o => o.id === id);
    if (overlay) {
      dispatch(updateTextOverlay({
        ...overlay,
        ...updates,
      }));
    }
  }, [dispatch, textOverlays]);

  const handleRemoveOverlay = useCallback((id: string) => {
    dispatch(removeTextOverlay(id));
  }, [dispatch]);

  const handleResetOverlays = useCallback(() => {
    dispatch(resetOverlays());
  }, [dispatch]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddText();
    }
  }, [handleAddText]);

  // Memoized input change handlers
  const handleNewTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewText(e.target.value);
  }, []);

  const handleTextColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTextColor(e.target.value);
  }, []);

  const handleFontSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFontSize(parseInt(e.target.value) || 24);
  }, []);

  const handleXPositionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setXPosition(parseInt(e.target.value) || 0);
  }, []);

  const handleYPositionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setYPosition(parseInt(e.target.value) || 0);
  }, []);

  // Memoized computed values
  const overlayCount = useMemo(() => textOverlays.length, [textOverlays.length]);
  const isAddButtonDisabled = useMemo(() => !newText.trim(), [newText]);

  return (
    <div className="bg-slate-800 rounded-lg md:rounded-lg sm:rounded-md p-6 md:p-6 sm:p-3 overflow-y-auto pb-24 md:pb-24 sm:pb-16">
      <div className="flex justify-between items-center mb-4 md:mb-4 sm:mb-3">
        <h3 className="text-lg md:text-lg sm:text-base font-semibold text-gray-200">Text Overlay</h3>
        <button
          onClick={handleResetOverlays}
          className="p-2 md:p-2 sm:p-1.5 text-gray-500 hover:text-gray-300 hover:bg-slate-700 rounded-lg md:rounded-lg sm:rounded-md transition-colors"
          title="Reset overlays"
        >
          <RotateCcw className="w-4 h-4 md:w-4 md:h-4 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Add New Text Section */}
      <div className="mb-6 md:mb-6 sm:mb-4 p-4 md:p-4 sm:p-3 bg-slate-700 rounded-lg md:rounded-lg sm:rounded-md">
        <h4 className="text-sm md:text-sm sm:text-xs font-medium text-gray-300 mb-3 md:mb-3 sm:mb-2">Add New Text</h4>
        
        <div className="mb-3 md:mb-3 sm:mb-2">
          <label className="block text-sm md:text-sm sm:text-xs font-medium text-gray-400 mb-2 md:mb-2 sm:mb-1">Text</label>
          <div className="flex gap-2 md:gap-2 sm:gap-1">
            <input
              type="text"
              value={newText}
              onChange={handleNewTextChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter text..."
              className="flex-1 px-3 py-2 md:px-3 md:py-2 sm:px-2 sm:py-1.5 border bg-slate-600 border-gray-500 rounded-md md:rounded-md sm:rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-sm md:text-sm sm:text-xs"
            />
            <button
              onClick={handleAddText}
              disabled={isAddButtonDisabled}
              className="px-4 py-2 md:px-4 md:py-2 sm:px-3 sm:py-1.5 bg-blue-500 text-white rounded-md md:rounded-md sm:rounded hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4 md:w-4 md:h-4 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-3 sm:gap-2 mb-3 md:mb-3 sm:mb-2">
          <div>
            <label className="block text-sm md:text-sm sm:text-xs font-medium text-gray-400 mb-1 md:mb-1 sm:mb-0.5">Font Size</label>
            <input
              type="number"
              value={fontSize}
              onChange={handleFontSizeChange}
              min="10"
              max="100"
              className="w-full px-3 py-2 md:px-3 md:py-2 sm:px-2 sm:py-1.5 bg-slate-600 border border-gray-500 rounded-md md:rounded-md sm:rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm md:text-sm sm:text-xs"
            />
          </div>
          <div>
            <label className="block text-sm md:text-sm sm:text-xs font-medium text-gray-400 mb-1 md:mb-1 sm:mb-0.5">Color</label>
            <input
              type="color"
              value={textColor}
              onChange={handleTextColorChange}
              className="w-full h-10 md:h-10 sm:h-8 bg-slate-600 border border-gray-500 rounded-md md:rounded-md sm:rounded cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-3 sm:gap-2">
          <div>
            <label className="block text-sm md:text-sm sm:text-xs font-medium text-gray-400 mb-1 md:mb-1 sm:mb-0.5">X Position</label>
            <input
              type="number"
              value={xPosition}
              onChange={handleXPositionChange}
              min="-1000"
              max="1000"
              className="w-full px-3 py-2 md:px-3 md:py-2 sm:px-2 sm:py-1.5 bg-slate-600 border border-gray-500 rounded-md md:rounded-md sm:rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm md:text-sm sm:text-xs"
            />
          </div>
          <div>
            <label className="block text-sm md:text-sm sm:text-xs font-medium text-gray-400 mb-1 md:mb-1 sm:mb-0.5">Y Position</label>
            <input
              type="number"
              value={yPosition}
              onChange={handleYPositionChange}
              min="-1000"
              max="1000"
              className="w-full px-3 py-2 md:px-3 md:py-2 sm:px-2 sm:py-1.5 bg-slate-600 border border-gray-500 rounded-md md:rounded-md sm:rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm md:text-sm sm:text-xs"
            />
          </div>
        </div>
      </div>

      {/* Existing Text Overlays */}
      {overlayCount > 0 && (
        <div>
          <h4 className="text-sm md:text-sm sm:text-xs font-medium text-gray-400 mb-3 md:mb-3 sm:mb-2">
            Active Text Overlays ({overlayCount})
          </h4>
          <div className="space-y-3 md:space-y-3 sm:space-y-2 max-h-96 md:max-h-96 sm:max-h-64 overflow-y-auto">
            {textOverlays.map((overlay) => (
              <OverlayItem
                key={overlay.id}
                overlay={overlay}
                onUpdate={handleUpdateOverlay}
                onUpdatePosition={handleUpdatePosition}
                onRemove={handleRemoveOverlay}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverlayPanel;
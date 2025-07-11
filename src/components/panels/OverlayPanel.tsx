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
    <div className="p-3 bg-slate-700 rounded-lg border border-slate-600">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center flex-1 min-w-0">
          <Type className="w-4 h-4 text-gray-300 mr-2 flex-shrink-0" />
          <span className="text-sm text-gray-200 truncate font-medium" title={overlay.text}>
            {overlay.text}
          </span>
        </div>
        <button
          onClick={handleRemove}
          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors flex-shrink-0 ml-2"
          title="Remove text overlay"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Text Content */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-400 mb-1">Text</label>
        <input
          type="text"
          value={overlay.text}
          onChange={handleTextChange}
          className="w-full px-2 py-1 bg-slate-600 border border-gray-500 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Position Controls */}
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-400 mb-1">
          <Move className="w-3 h-3 inline mr-1" />
          Position
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-gray-500 mb-1">X</label>
            <input
              type="number"
              value={overlay.x}
              onChange={handleXPositionChange}
              min="-1000"
              max="1000"
              className="w-full px-2 py-1 bg-slate-600 border border-gray-500 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Y</label>
            <input
              type="number"
              value={overlay.y}
              onChange={handleYPositionChange}
              min="-1000"
              max="1000"
              className="w-full px-2 py-1 bg-slate-600 border border-gray-500 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Style Controls */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Font Size</label>
          <input
            type="number"
            value={overlay.fontSize}
            onChange={handleFontSizeChange}
            min="10"
            max="100"
            className="w-full px-2 py-1 bg-slate-600 border border-gray-500 rounded text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Color</label>
          <input
            type="color"
            value={overlay.color}
            onChange={handleColorChange}
            className="w-full h-8 bg-slate-600 border border-gray-500 rounded cursor-pointer"
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
    <div className="bg-slate-800 rounded-lg p-6 overflow-y-auto pb-24">
      <div className="flex justify-between items-center mb-4">
        <h3 className="md:text-lg text-md font-semibold text-gray-200">Text Overlay</h3>
        <button
          onClick={handleResetOverlays}
          className="p-2 text-gray-500 hover:text-gray-300 hover:bg-slate-700 rounded-lg transition-colors"
          title="Reset overlays"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Add New Text Section */}
      <div className="mb-6 p-4 bg-slate-700 rounded-lg">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Add New Text</h4>
        
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-400 mb-2">Text</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newText}
              onChange={handleNewTextChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter text..."
              className="flex-1 px-3 py-2 border bg-slate-600 border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
            <button
              onClick={handleAddText}
              disabled={isAddButtonDisabled}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Font Size</label>
            <input
              type="number"
              value={fontSize}
              onChange={handleFontSizeChange}
              min="10"
              max="100"
              className="w-full px-3 py-2 bg-slate-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Color</label>
            <input
              type="color"
              value={textColor}
              onChange={handleTextColorChange}
              className="w-full h-10 bg-slate-600 border border-gray-500 rounded-md cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">X Position</label>
            <input
              type="number"
              value={xPosition}
              onChange={handleXPositionChange}
              min="-1000"
              max="1000"
              className="w-full px-3 py-2 bg-slate-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Y Position</label>
            <input
              type="number"
              value={yPosition}
              onChange={handleYPositionChange}
              min="-1000"
              max="1000"
              className="w-full px-3 py-2 bg-slate-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
          </div>
        </div>
      </div>

      {/* Existing Text Overlays */}
      {overlayCount > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            Active Text Overlays ({overlayCount})
          </h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
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
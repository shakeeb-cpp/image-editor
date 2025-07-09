import React, { useState } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addTextOverlay, updateTextOverlay, removeTextOverlay } from '../../store/slices/overlaySlice';
import { Plus, Trash2, Type } from 'lucide-react';

const TextPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { textOverlays } = useAppSelector(state => state.overlay);
  const [newText, setNewText] = useState('');
  
  const addText = () => {
    if (newText.trim()) {
      dispatch(addTextOverlay({
        id: Date.now().toString(),
        text: newText,
        x: 50,
        y: 50,
        fontSize: 24,
        color: '#ffffff',
        fontFamily: 'Arial'
      }));
      setNewText('');
    }
  };
  
  const fontFamilies = ['Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana'];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Text Overlay</h3>
        <Type className="w-5 h-5 text-slate-400" />
      </div>
      
      <div className="space-y-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Enter text..."
            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={addText}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
        
        {textOverlays.map(overlay => (
          <div key={overlay.id} className="p-3 bg-slate-800 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white truncate">{overlay.text}</span>
              <button
                onClick={() => dispatch(removeTextOverlay(overlay.id))}
                className="p-1 text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400">Font Size</label>
                  <input
                    type="number"
                    value={overlay.fontSize}
                    onChange={(e) => dispatch(updateTextOverlay({
                      id: overlay.id,
                      updates: { fontSize: Number(e.target.value) }
                    }))}
                    className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Color</label>
                  <input
                    type="color"
                    value={overlay.color}
                    onChange={(e) => dispatch(updateTextOverlay({
                      id: overlay.id,
                      updates: { color: e.target.value }
                    }))}
                    className="w-full h-7 bg-slate-700 border border-slate-600 rounded"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs text-slate-400">Font Family</label>
                <select
                  value={overlay.fontFamily}
                  onChange={(e) => dispatch(updateTextOverlay({
                    id: overlay.id,
                    updates: { fontFamily: e.target.value }
                  }))}
                  className="w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-xs"
                >
                  {fontFamilies.map(font => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TextPanel;
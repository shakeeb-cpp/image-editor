import React, { useRef, useEffect, useState } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import {
  FolderOpen,
  Zap,
} from 'lucide-react';
// import { applyUndo, applyRedo } from '../store/slices/historySlice';
import { downloadImage, ExportFormat } from '../utils/cloudinary';
import { setUploading, setImage, setError } from '../store/slices/imageSlice';
import { useCloudinary } from '../hooks/useCloudinary';
import ExportDropdown from './ui/ExportDropdown';
import ExportModal from './ui/ExportModal';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { transformedUrl, isUploading, publicId } = useAppSelector(state => state.image);
  // const { canUndo, canRedo } = useAppSelector(state => state.history);
  const { uploadImage, saveToHistory } = useCloudinary();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('jpeg');
  const [showExportModal, setShowExportModal] = useState(false);

  // Create initial snapshot when image is loaded
  useEffect(() => {
    if (publicId) {
      saveToHistory();
    }
  }, [publicId, saveToHistory]);

  const handleExport = async (format: ExportFormat) => {
    if (!transformedUrl) return;

    setExportFormat(format);
    setIsExporting(true);
    setExportProgress(0);
    setShowExportModal(true);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      // Download the image
      await downloadImage(transformedUrl, format);

      // Complete the progress
      clearInterval(progressInterval);
      setExportProgress(100);

      // Auto-close modal after 2 seconds when complete
      setTimeout(() => {
        setShowExportModal(false);
        setIsExporting(false);
        setExportProgress(0);
      }, 2000);

    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      setShowExportModal(false);
      setExportProgress(0);
      dispatch(setError('Failed to export image. Please try again.'));
    }
  };

  const handleCloseExportModal = () => {
    setShowExportModal(false);
    setIsExporting(false);
    setExportProgress(0);
  };

  // const handleUndo = () => {
  //   dispatch(applyUndo());
  // };

  // const handleRedo = () => {
  //   dispatch(applyRedo());
  // };

  const handleOpenClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

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
      console.log(err)
      dispatch(setError('Failed to upload image. Please try again.'));
    } finally {
      dispatch(setUploading(false));
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-700 px-4 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="md:text-xl text-md font-bold text-white">ImageCraft</span>
        </div>

      </div>

      <div className="flex items-center space-x-3">

        {/* <div className="flex items-center space-x-1">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>

        </div> */}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleOpenClick}
          className="px-3 py-1.5 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center space-x-1 transition-colors"
          disabled={isUploading}
        >
          <FolderOpen className="w-4 h-4" />
          <span>{isUploading ? 'Uploading...' : 'Open'}</span>
        </button>

        <ExportDropdown
          onExport={handleExport}
          disabled={!transformedUrl || isExporting}
        />
      </div>

      <ExportModal
        isOpen={showExportModal}
        progress={exportProgress}
        format={exportFormat}
        onClose={handleCloseExportModal}
      />
    </header>
  );
};

export default Header;





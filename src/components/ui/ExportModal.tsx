import React from 'react';
import { X } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface ExportModalProps {
  isOpen: boolean;
  progress: number;
  format: string;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ 
  isOpen, 
  progress, 
  format, 
  onClose 
}) => {
  if (!isOpen) return null;

  const isComplete = progress >= 100;

  return (
    <div className="fixed inset-0 bg-slate-950 bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 w-96 max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="md:text-lg text-md font-semibold text-white">
            {isComplete ? 'Export Complete!' : 'Exporting Image...'}
          </h3>
          {isComplete && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="mb-4">
          <p className="text-slate-300 text-sm mb-2">
            {isComplete 
              ? `Your image has been downloaded as ${format.toUpperCase()}`
              : `Preparing your image in ${format.toUpperCase()} format...`
            }
          </p>
        </div>

        <ProgressBar
          progress={progress}
          isVisible={true}
          label={isComplete ? 'Download complete' : 'Processing...'}
          color="green"
          size="md"
          showPercentage={true}
        />

        {isComplete && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportModal;

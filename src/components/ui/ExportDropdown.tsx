import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown } from 'lucide-react';

export type ExportFormat = 'jpeg' | 'png' | 'webp';

interface ExportOption {
  format: ExportFormat;
  label: string;
  description: string;
}

interface ExportDropdownProps {
  onExport: (format: ExportFormat) => void;
  disabled?: boolean;
}

const exportOptions: ExportOption[] = [
  {
    format: 'jpeg',
    label: 'Download as JPEG',
    description: 'Best for photos with many colors'
  },
  {
    format: 'png',
    label: 'Download as PNG',
    description: 'Best for images with transparency'
  },
  {
    format: 'webp',
    label: 'Download as WebP',
    description: 'Modern format with smaller file size'
  }
];

const ExportDropdown: React.FC<ExportDropdownProps> = ({ onExport, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (format: ExportFormat) => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        <span>Export</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {exportOptions.map((option) => (
              <button
                key={option.format}
                onClick={() => handleOptionClick(option.format)}
                className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors"
              >
                <div className="text-sm font-medium text-white">
                  {option.label}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;

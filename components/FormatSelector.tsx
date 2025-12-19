/**
 * Format Selector Component
 * 
 * Provides an intuitive interface for selecting the target conversion format.
 * Displays format information including descriptions to help users make informed choices.
 */

'use client';

import { SUPPORTED_FORMATS } from '@/lib/constants';
import { SupportedFormat } from '@/lib/types';

interface FormatSelectorProps {
  selectedFormat: SupportedFormat | null;
  onFormatChange: (format: SupportedFormat) => void;
  disabled?: boolean;
}

export function FormatSelector({ selectedFormat, onFormatChange, disabled = false }: FormatSelectorProps) {
  return (
    <div className="w-full">
      <label htmlFor="format-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Convert to
      </label>
      
      {/* Custom radio group for better UX */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {SUPPORTED_FORMATS.map((format) => (
          <button
            key={format.value}
            type="button"
            onClick={() => onFormatChange(format.value)}
            disabled={disabled}
            className={`
              relative p-4 rounded-lg border-2 text-left transition-all
              ${selectedFormat === format.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            aria-pressed={selectedFormat === format.value}
          >
            {/* Selected indicator */}
            {selectedFormat === format.value && (
              <div className="absolute top-2 right-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}

            {/* Format label */}
            <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {format.label}
            </div>

            {/* Format description */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {format.description}
            </div>
          </button>
        ))}
      </div>

      {/* Additional format info */}
      {selectedFormat && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Selected:</strong> {SUPPORTED_FORMATS.find(f => f.value === selectedFormat)?.label} format
            {' - '}
            {SUPPORTED_FORMATS.find(f => f.value === selectedFormat)?.description}
          </p>
        </div>
      )}
    </div>
  );
}

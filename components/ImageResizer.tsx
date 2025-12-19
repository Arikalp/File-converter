/**
 * Image Resize Options Component
 * 
 * Allows users to specify custom dimensions for the output image
 * Supports various resize modes (maintain aspect ratio, exact dimensions, etc.)
 */

'use client';

import { useState } from 'react';

export interface ResizeOptions {
  enabled: boolean;
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
}

interface ImageResizerProps {
  options: ResizeOptions;
  onOptionsChange: (options: ResizeOptions) => void;
  disabled?: boolean;
}

export function ImageResizer({ options, onOptionsChange, disabled = false }: ImageResizerProps) {
  const [localWidth, setLocalWidth] = useState(options.width?.toString() || '');
  const [localHeight, setLocalHeight] = useState(options.height?.toString() || '');

  const handleEnabledToggle = () => {
    onOptionsChange({
      ...options,
      enabled: !options.enabled,
    });
  };

  const handleWidthChange = (value: string) => {
    setLocalWidth(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onOptionsChange({
        ...options,
        width: numValue,
      });
    } else if (value === '') {
      onOptionsChange({
        ...options,
        width: undefined,
      });
    }
  };

  const handleHeightChange = (value: string) => {
    setLocalHeight(value);
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onOptionsChange({
        ...options,
        height: numValue,
      });
    } else if (value === '') {
      onOptionsChange({
        ...options,
        height: undefined,
      });
    }
  };

  const handleAspectRatioToggle = () => {
    onOptionsChange({
      ...options,
      maintainAspectRatio: !options.maintainAspectRatio,
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Enable/Disable Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Resize Image
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Optionally resize the output image
          </p>
        </div>
        <button
          type="button"
          onClick={handleEnabledToggle}
          disabled={disabled}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${options.enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          role="switch"
          aria-checked={options.enabled}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${options.enabled ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {/* Resize Options (shown when enabled) */}
      {options.enabled && (
        <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {/* Width and Height Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="width-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Width (px)
              </label>
              <input
                id="width-input"
                type="number"
                min="1"
                max="10000"
                value={localWidth}
                onChange={(e) => handleWidthChange(e.target.value)}
                disabled={disabled}
                placeholder="Auto"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="height-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Height (px)
              </label>
              <input
                id="height-input"
                type="number"
                min="1"
                max="10000"
                value={localHeight}
                onChange={(e) => handleHeightChange(e.target.value)}
                disabled={disabled}
                placeholder="Auto"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              />
            </div>
          </div>

          {/* Maintain Aspect Ratio Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.maintainAspectRatio}
              onChange={handleAspectRatioToggle}
              disabled={disabled}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Maintain aspect ratio
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Automatically calculate missing dimension
              </p>
            </div>
          </label>

          {/* Info Message */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Leave width or height empty for automatic calculation. Set both for exact dimensions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

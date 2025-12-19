/**
 * Quality Slider Component
 * 
 * Allows users to adjust the quality/compression level for the output file.
 * Quality affects both file size and visual quality for lossy formats.
 */

'use client';

import { ChangeEvent } from 'react';

interface QualitySliderProps {
  quality: number;
  onQualityChange: (quality: number) => void;
  disabled?: boolean;
}

export function QualitySlider({ quality, onQualityChange, disabled = false }: QualitySliderProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onQualityChange(parseInt(e.target.value, 10));
  };

  // Determine quality label based on value
  const getQualityLabel = (value: number): string => {
    if (value >= 90) return 'Maximum';
    if (value >= 75) return 'High';
    if (value >= 50) return 'Medium';
    if (value >= 25) return 'Low';
    return 'Minimum';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="quality-slider" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Quality
        </label>
        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
          {quality}% ({getQualityLabel(quality)})
        </span>
      </div>

      {/* Range slider */}
      <input
        id="quality-slider"
        type="range"
        min="1"
        max="100"
        value={quality}
        onChange={handleChange}
        disabled={disabled}
        className={`
          w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer
          accent-blue-500
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        aria-label={`Quality: ${quality}%`}
      />

      {/* Quality scale labels */}
      <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Smaller file</span>
        <span>Better quality</span>
      </div>

      {/* Info text */}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Higher quality = larger file size. 90% is recommended for most uses.
      </p>
    </div>
  );
}

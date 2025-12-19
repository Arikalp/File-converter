/**
 * Image Preview Component
 * 
 * Displays a preview of the uploaded image with metadata
 * Shows dimensions, file size, and format information
 */

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
}

interface ImageInfo {
  url: string;
  width: number;
  height: number;
}

export function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);

  useEffect(() => {
    // Create object URL for preview
    const url = URL.createObjectURL(file);

    // Get image dimensions
    const img = new window.Image();
    img.onload = () => {
      setImageInfo({
        url,
        width: img.width,
        height: img.height,
      });
    };
    img.src = url;

    // Cleanup on unmount
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!imageInfo) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Image Preview */}
      <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="relative w-full h-64 flex items-center justify-center p-4">
          <img
            src={imageInfo.url}
            alt="Preview"
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Remove button */}
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
          aria-label="Remove image"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Image Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Dimensions</p>
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            {imageInfo.width} × {imageInfo.height}
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">File Size</p>
          <p className="text-sm font-semibold text-green-900 dark:text-green-100">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">Format</p>
          <p className="text-sm font-semibold text-purple-900 dark:text-purple-100 uppercase">
            {file.type.split('/')[1]}
          </p>
        </div>

        <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">Aspect Ratio</p>
          <p className="text-sm font-semibold text-orange-900 dark:text-orange-100">
            {(imageInfo.width / imageInfo.height).toFixed(2)}:1
          </p>
        </div>
      </div>
    </div>
  );
}

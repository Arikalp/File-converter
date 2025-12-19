/**
 * File Upload Component
 * 
 * A reusable client component for file upload with drag-and-drop support.
 * Uses modern Web APIs and provides excellent UX with visual feedback.
 * 
 * Features:
 * - Drag and drop file upload
 * - Click to browse files
 * - Real-time file validation
 * - Visual feedback for drag states
 * - Accessible keyboard navigation
 * - File preview display
 */

'use client';

import { useCallback, useState, DragEvent, ChangeEvent } from 'react';
import { validateFile } from '@/lib/validation';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, selectedFile, disabled = false }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles file validation and selection
   * Validates file before passing it to parent component
   */
  const handleFile = useCallback((file: File) => {
    setError(null);
    
    // Validate file using our security validation utility
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    // File is valid, pass it to parent
    onFileSelect(file);
  }, [onFileSelect]);

  /**
   * Handles drag over event
   * Required to enable drop functionality
   */
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  /**
   * Handles drag leave event
   * Resets drag state when mouse leaves drop zone
   */
  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  /**
   * Handles file drop event
   * Extracts file from drag event and validates it
   */
  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    // Get the dropped files
    const files = e.dataTransfer.files;
    
    if (files && files.length > 0) {
      // Only handle the first file (single file upload)
      handleFile(files[0]);
    }
  }, [disabled, handleFile]);

  /**
   * Handles file selection via input element
   */
  const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  return (
    <div className="w-full">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {/* Hidden file input */}
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          disabled={disabled}
          className="hidden"
          aria-label="Upload file"
        />

        {/* Upload icon and text */}
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center gap-4 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {/* Upload Icon */}
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          {/* Instructions */}
          <div className="space-y-1">
            <p className="text-base font-medium text-gray-700 dark:text-gray-300">
              {isDragging ? 'Drop your file here' : 'Drop your file here or click to browse'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supported: PNG, JPG, WEBP, AVIF, TIFF, GIF (Max 10MB)
            </p>
          </div>
        </label>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Selected file info */}
      {selectedFile && !error && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start gap-3">
            {/* File icon */}
            <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>

            {/* File details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-green-800 dark:text-green-300 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * File Converter - Main Page
 * 
 * This is the main page component for the file converter application.
 * It orchestrates the file upload, format selection, and conversion process.
 * 
 * Architecture:
 * - Client Component (uses React hooks and browser APIs)
 * - Calls Server Actions for file conversion
 * - Manages state for file, format selection, and conversion progress
 * - Handles download of converted files using Blob API
 * 
 * User Flow:
 * 1. User uploads a file (drag & drop or click)
 * 2. User previews the image with metadata
 * 3. User selects target format
 * 4. User adjusts quality and resize options (optional)
 * 5. User clicks convert
 * 6. Server processes the file
 * 7. User downloads the converted file
 */

'use client';

import { useState, FormEvent } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { FormatSelector } from '@/components/FormatSelector';
import { QualitySlider } from '@/components/QualitySlider';
import { ImagePreview } from '@/components/ImagePreview';
import { ImageResizer, ResizeOptions } from '@/components/ImageResizer';
import { convertFile } from '@/app/actions/convert';
import { SupportedFormat } from '@/lib/types';
import { DEFAULT_QUALITY } from '@/lib/constants';

export default function Home() {
  // State management
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<SupportedFormat | null>(null);
  const [quality, setQuality] = useState<number>(DEFAULT_QUALITY);
  const [resizeOptions, setResizeOptions] = useState<ResizeOptions>({
    enabled: false,
    maintainAspectRatio: true,
  });
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState<number | null>(null);

  /**
   * Handles the form submission and file conversion process
   * 
   * Process:
   * 1. Create FormData with file and conversion parameters
   * 2. Call Server Action to convert file
   * 3. Handle response (success or error)
   * 4. Trigger download if successful
   */
  const handleConvert = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset messages
    setError(null);
    setSuccess(null);

    // Validate inputs
    if (!selectedFile) {
      setError('Please select a file to convert');
      return;
    }

    if (!targetFormat) {
      setError('Please select a target format');
      return;
    }

    setIsConverting(true);

    try {
      // Create FormData to send to Server Action
      // FormData is automatically serialized by Next.js
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('targetFormat', targetFormat);
      formData.append('quality', quality.toString());

      // Add resize options if enabled
      if (resizeOptions.enabled) {
        if (resizeOptions.width) {
          formData.append('width', resizeOptions.width.toString());
        }
        if (resizeOptions.height) {
          formData.append('height', resizeOptions.height.toString());
        }
        if (resizeOptions.maintainAspectRatio) {
          formData.append('maintainAspectRatio', 'true');
        }
      }

      // Call Server Action to convert the file
      // This runs on the server and returns the converted file
      const response = await convertFile(formData);

      if (response.success && response.data && response.fileName && response.mimeType) {
        // Create a Blob from the converted data
        // Blob represents the file in memory for download
        // Convert to Uint8Array to ensure proper ArrayBuffer type
        const data = new Uint8Array(response.data);
        const blob = new Blob([data], { type: response.mimeType });
        
        // Create a temporary URL for the Blob
        // This allows us to trigger a download in the browser
        const url = URL.createObjectURL(blob);
        
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = response.fileName;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup: remove the temporary elements and URL
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Store output file size for comparison
        setOutputSize(blob.size);

        setSuccess(`File converted successfully! Original: ${(selectedFile.size / 1024).toFixed(1)}KB → New: ${(blob.size / 1024).toFixed(1)}KB`);
        
        // Reset form after successful conversion
        setTimeout(() => {
          setSelectedFile(null);
          setTargetFormat(null);
          setQuality(DEFAULT_QUALITY);
          setResizeOptions({ enabled: false, maintainAspectRatio: true });
          setOutputSize(null);
          setSuccess(null);
        }, 5000);
      } else {
        setError(response.error || 'Conversion failed');
      }
    } catch (err) {
      console.error('Conversion error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* App Icon */}
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                File Converter
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Convert images to different formats instantly
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <form onSubmit={handleConvert} className="space-y-8">
          {/* Conversion Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Step 1: Upload File */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  1
                </span>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload Your File
                </h2>
              </div>
              <FileUpload
                onFileSelect={setSelectedFile}
                selectedFile={selectedFile}
                disabled={isConverting}
              />
            </div>

            {/* Image Preview (shown after file upload) */}
            {selectedFile && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 font-semibold text-sm">
                    ✓
                  </span>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Image Preview
                  </h2>
                </div>
                <ImagePreview
                  file={selectedFile}
                  onRemove={() => {
                    setSelectedFile(null);
                    setTargetFormat(null);
                    setResizeOptions({ enabled: false, maintainAspectRatio: true });
                  }}
                />
              </div>
            )}

            {/* Step 2: Select Format */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  2
                </span>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Choose Output Format
                </h2>
              </div>
              <FormatSelector
                selectedFormat={targetFormat}
                onFormatChange={setTargetFormat}
                disabled={isConverting || !selectedFile}
              />
            </div>

            {/* Step 3: Adjust Quality */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  3
                </span>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Adjust Quality (Optional)
                </h2>
              </div>
              <QualitySlider
                quality={quality}
                onQualityChange={setQuality}
                disabled={isConverting || !selectedFile}
              />
            </div>

            {/* Step 4: Resize Options */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  4
                </span>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Resize Image (Optional)
                </h2>
              </div>
              <ImageResizer
                options={resizeOptions}
                onOptionsChange={setResizeOptions}
                disabled={isConverting || !selectedFile}
              />
            </div>

            {/* Convert Button */}
            <button
              type="submit"
              disabled={!selectedFile || !targetFormat || isConverting}
              className={`
                w-full py-4 px-6 rounded-xl font-semibold text-white text-lg
                transition-all duration-200 transform
                ${!selectedFile || !targetFormat || isConverting
                  ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-98 shadow-lg hover:shadow-xl'
                }
              `}
            >
              {isConverting ? (
                <span className="flex items-center justify-center gap-3">
                  {/* Loading spinner */}
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Converting...
                </span>
              ) : (
                'Convert File'
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">{success}</p>
                </div>
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Important Notes
            </h3>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span><strong>Raster to Vector:</strong> Converting PNG/JPG to SVG is not supported. SVG is a vector format and requires manual tracing or AI-based vectorization.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span><strong>File Size Limit:</strong> Maximum upload size is 10MB. For larger files, consider compressing before upload.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span><strong>Quality Settings:</strong> Higher quality means better image but larger file size. 90% is recommended for web use.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                <span><strong>Privacy:</strong> All conversions happen on the server. Files are not stored permanently.</span>
              </li>
            </ul>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Made with ❤️ by Sankalp • Built with Next.js, TypeScript, and Sharp
          </p>
        </div>
      </footer>
    </div>
  );
}


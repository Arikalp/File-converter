/**
 * Application Constants
 * 
 * Centralized configuration for file upload limits, supported formats,
 * and validation rules. These values can be adjusted based on deployment
 * environment and infrastructure constraints.
 */

import { FormatInfo, SupportedFormat } from './types';

/**
 * Maximum file size allowed for upload (10MB)
 * This limit ensures efficient processing and prevents memory issues.
 * Adjust based on your server's memory capacity and Vercel's serverless function limits.
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

/**
 * Allowed MIME types for uploaded files
 * Only image formats that can be processed by Sharp are permitted.
 * This provides the first layer of security against malicious uploads.
 */
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/tiff',
  'image/gif',
  'image/svg+xml', // Note: SVG to raster conversion only
] as const;

/**
 * Maximum file name length to prevent path traversal attacks
 */
export const MAX_FILENAME_LENGTH = 255;

/**
 * Default quality setting for lossy compression formats (1-100)
 * Higher values = better quality but larger file size
 */
export const DEFAULT_QUALITY = 90;

/**
 * Supported output formats with metadata for UI display
 * Each format includes user-friendly labels and descriptions
 */
export const SUPPORTED_FORMATS: FormatInfo[] = [
  {
    value: 'jpeg',
    label: 'JPEG',
    description: 'Best for photos, smaller file size',
    extension: '.jpg',
  },
  {
    value: 'png',
    label: 'PNG',
    description: 'Lossless, supports transparency',
    extension: '.png',
  },
  {
    value: 'webp',
    label: 'WebP',
    description: 'Modern format, excellent compression',
    extension: '.webp',
  },
  {
    value: 'avif',
    label: 'AVIF',
    description: 'Next-gen format, best compression',
    extension: '.avif',
  },
  {
    value: 'tiff',
    label: 'TIFF',
    description: 'High quality, large file size',
    extension: '.tiff',
  },
  {
    value: 'gif',
    label: 'GIF',
    description: 'Limited colors, supports animation',
    extension: '.gif',
  },
];

/**
 * Quality ranges for different formats
 * Different formats have different quality parameter scales
 */
export const QUALITY_RANGES: Record<SupportedFormat, { min: number; max: number }> = {
  jpeg: { min: 1, max: 100 },
  jpg: { min: 1, max: 100 },
  webp: { min: 1, max: 100 },
  avif: { min: 1, max: 100 },
  png: { min: 1, max: 9 }, // PNG uses compression level 0-9
  tiff: { min: 1, max: 100 },
  gif: { min: 1, max: 100 },
};

/**
 * Error messages for better UX
 */
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
  INVALID_FILE_TYPE: 'Invalid file type. Please upload an image file',
  NO_FILE_SELECTED: 'Please select a file to convert',
  CONVERSION_FAILED: 'Failed to convert file. Please try again',
  INVALID_FORMAT: 'Invalid target format selected',
  SERVER_ERROR: 'Server error occurred. Please try again later',
} as const;

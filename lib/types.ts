/**
 * Type Definitions for File Converter Application
 * 
 * This file contains all TypeScript types and interfaces used throughout the application.
 * Centralizing types improves maintainability and type safety.
 */

/**
 * Supported image format types for conversion
 * - JPEG/JPG: Lossy compression, good for photos
 * - PNG: Lossless compression, supports transparency
 * - WEBP: Modern format with superior compression
 * - AVIF: Next-gen format with excellent compression (limited browser support)
 * - TIFF: High-quality format, commonly used in professional photography
 * - GIF: Supports animation, limited color palette
 */
export type SupportedFormat = 'jpeg' | 'jpg' | 'png' | 'webp' | 'avif' | 'tiff' | 'gif';

/**
 * Format information for UI display
 */
export interface FormatInfo {
  value: SupportedFormat;
  label: string;
  description: string;
  extension: string;
}

/**
 * File conversion request parameters
 */
export interface ConversionRequest {
  file: File;
  targetFormat: SupportedFormat;
  quality?: number; // 1-100, applicable for lossy formats
}

/**
 * File conversion response
 */
export interface ConversionResponse {
  success: boolean;
  data?: Uint8Array | Buffer;
  fileName?: string;
  mimeType?: string;
  error?: string;
  message?: string;
}

/**
 * File validation result
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Conversion options for Sharp
 */
export interface ConversionOptions {
  format: SupportedFormat;
  quality?: number;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

/**
 * File metadata extracted from uploaded file
 */
export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

/**
 * Conversion job status (for future enhancement with job queue)
 */
export interface ConversionJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  metadata: FileMetadata;
  targetFormat: SupportedFormat;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

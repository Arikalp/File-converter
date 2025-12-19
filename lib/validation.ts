/**
 * File Validation Utilities
 * 
 * Provides security-focused validation functions for uploaded files.
 * These functions form the first line of defense against malicious uploads
 * and ensure only valid files are processed.
 */

import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE, MAX_FILENAME_LENGTH, ERROR_MESSAGES } from './constants';
import { ValidationResult } from './types';

/**
 * Validates the uploaded file against security and size constraints
 * 
 * Security checks performed:
 * 1. File existence check
 * 2. File size validation (prevents DoS attacks)
 * 3. MIME type validation (prevents execution of malicious files)
 * 4. Filename length validation (prevents path traversal)
 * 5. Filename sanitization check
 * 
 * @param file - The uploaded File object from the browser
 * @returns ValidationResult object with isValid flag and optional error message
 */
export function validateFile(file: File | null | undefined): ValidationResult {
  // Check if file exists
  if (!file) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.NO_FILE_SELECTED,
    };
  }

  // Validate file size (prevents memory exhaustion and DoS attacks)
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: ERROR_MESSAGES.FILE_TOO_LARGE,
    };
  }

  // Validate file size is not zero
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty',
    };
  }

  // Validate MIME type (prevents uploading executable files disguised as images)
  if (!ALLOWED_MIME_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      error: `${ERROR_MESSAGES.INVALID_FILE_TYPE}. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`,
    };
  }

  // Validate filename length (prevents path traversal attacks)
  if (file.name.length > MAX_FILENAME_LENGTH) {
    return {
      isValid: false,
      error: `Filename too long. Maximum ${MAX_FILENAME_LENGTH} characters allowed`,
    };
  }

  // Sanitize filename - check for suspicious characters
  const sanitizedName = sanitizeFilename(file.name);
  if (sanitizedName !== file.name) {
    return {
      isValid: false,
      error: 'Filename contains invalid characters',
    };
  }

  return { isValid: true };
}

/**
 * Sanitizes filename by removing potentially dangerous characters
 * Prevents path traversal and command injection attacks
 * 
 * @param filename - Original filename from user
 * @returns Sanitized filename safe for filesystem operations
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
    .replace(/\.{2,}/g, '.') // Prevent directory traversal with ".."
    .replace(/^\.+/, '') // Remove leading dots
    .slice(0, MAX_FILENAME_LENGTH); // Enforce max length
}

/**
 * Validates that the quality parameter is within acceptable range
 * 
 * @param quality - Quality value to validate (1-100)
 * @returns ValidationResult object
 */
export function validateQuality(quality: number | undefined): ValidationResult {
  if (quality === undefined) {
    return { isValid: true }; // Quality is optional
  }

  if (typeof quality !== 'number' || quality < 1 || quality > 100) {
    return {
      isValid: false,
      error: 'Quality must be a number between 1 and 100',
    };
  }

  return { isValid: true };
}

/**
 * Validates file extension matches the MIME type
 * Additional security layer to detect file type spoofing
 * 
 * @param filename - Name of the file
 * @param mimeType - MIME type from file object
 * @returns ValidationResult object
 */
export function validateFileExtension(filename: string, mimeType: string): ValidationResult {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const mimeToExtension: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp'],
    'image/avif': ['avif'],
    'image/tiff': ['tiff', 'tif'],
    'image/gif': ['gif'],
    'image/svg+xml': ['svg'],
  };

  const validExtensions = mimeToExtension[mimeType];
  
  if (!extension || !validExtensions || !validExtensions.includes(extension)) {
    return {
      isValid: false,
      error: 'File extension does not match the file type',
    };
  }

  return { isValid: true };
}

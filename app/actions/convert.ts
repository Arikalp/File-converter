/**
 * Server Actions for File Conversion
 * 
 * Server Actions are a Next.js 13+ feature that allows you to run
 * server-side code directly from client components without creating API routes.
 * 
 * Benefits:
 * - Simplified data flow (no need for separate API routes)
 * - Automatic serialization/deserialization
 * - Built-in error handling
 * - Type-safe by default with TypeScript
 * - Reduces client-side bundle size
 * 
 * Security Features:
 * - Runs only on server (never exposes conversion logic to client)
 * - Validates all inputs before processing
 * - Sanitizes file names and checks MIME types
 * - Enforces file size limits
 * 
 * Performance Considerations:
 * - Processes files in memory (suitable for files up to 10MB)
 * - Uses Sharp for efficient image processing
 * - Vercel serverless functions have 50MB memory limit on hobby plan
 * - For larger files, consider using streaming or external storage
 */

'use server';

import { convertImage, getFileExtension, getMimeType } from '@/lib/converter';
import { validateFile, validateQuality } from '@/lib/validation';
import { ConversionResponse, SupportedFormat } from '@/lib/types';
import { ERROR_MESSAGES } from '@/lib/constants';

/**
 * Converts an uploaded file to the specified format
 * 
 * This is a Server Action that can be called directly from client components.
 * The 'use server' directive at the top of the file marks all exports as server actions.
 * 
 * Security Flow:
 * 1. Validate FormData structure
 * 2. Extract and validate file
 * 3. Validate target format and quality
 * 4. Convert file using Sharp
 * 5. Return converted file data
 * 
 * @param formData - FormData object containing file and conversion parameters
 * @returns Promise<ConversionResponse> - Contains converted file data or error
 */
export async function convertFile(formData: FormData): Promise<ConversionResponse> {
  try {
    // Extract file from FormData
    // FormData is automatically serialized by Next.js Server Actions
    const file = formData.get('file') as File | null;
    const targetFormat = formData.get('targetFormat') as SupportedFormat;
    const qualityStr = formData.get('quality') as string | null;
    const widthStr = formData.get('width') as string | null;
    const heightStr = formData.get('height') as string | null;
    
    // Parse quality parameter (optional)
    const quality = qualityStr ? parseInt(qualityStr, 10) : undefined;
    
    // Parse resize parameters (optional)
    const width = widthStr ? parseInt(widthStr, 10) : undefined;
    const height = heightStr ? parseInt(heightStr, 10) : undefined;

    // Validate the uploaded file
    // This checks file size, MIME type, and other security constraints
    const fileValidation = validateFile(file);
    if (!fileValidation.isValid) {
      return {
        success: false,
        error: fileValidation.error,
      };
    }

    // Validate quality parameter if provided
    const qualityValidation = validateQuality(quality);
    if (!qualityValidation.isValid) {
      return {
        success: false,
        error: qualityValidation.error,
      };
    }

    // Validate target format
    if (!targetFormat) {
      return {
        success: false,
        error: ERROR_MESSAGES.INVALID_FORMAT,
      };
    }

    // At this point, TypeScript knows file is not null due to validation
    const validFile = file as File;

    // Convert File to Buffer for Sharp processing
    // arrayBuffer() is a Web API available in Node.js 16+
    const arrayBuffer = await validFile.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Perform the conversion using Sharp
    // This is CPU-intensive and runs on the server
    const outputBuffer = await convertImage(inputBuffer, {
      format: targetFormat,
      quality,
      width,
      height,
    });

    // Generate output filename
    // Remove original extension and add new one
    const originalName = validFile.name.split('.')[0];
    const newExtension = getFileExtension(targetFormat);
    const outputFileName = `${originalName}${newExtension}`;

    // Get MIME type for the output format
    const mimeType = getMimeType(targetFormat);

    // Return success response with converted file data
    // The buffer is automatically serialized by Next.js
    return {
      success: true,
      data: new Uint8Array(outputBuffer), // Convert Buffer to Uint8Array for serialization
      fileName: outputFileName,
      mimeType,
      message: 'File converted successfully',
    };

  } catch (error) {
    // Log error for debugging (use proper logging service in production)
    console.error('Conversion error in server action:', error);

    // Return user-friendly error message
    return {
      success: false,
      error: error instanceof Error ? error.message : ERROR_MESSAGES.CONVERSION_FAILED,
    };
  }
}

/**
 * Gets information about the uploaded file without converting it
 * Useful for displaying file details before conversion
 * 
 * @param formData - FormData containing the file
 * @returns Promise with file metadata
 */
export async function getFileInfo(formData: FormData): Promise<{
  success: boolean;
  data?: {
    name: string;
    size: number;
    type: string;
    sizeInMB: string;
  };
  error?: string;
}> {
  try {
    const file = formData.get('file') as File | null;

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    const validFile = file as File;

    return {
      success: true,
      data: {
        name: validFile.name,
        size: validFile.size,
        type: validFile.type,
        sizeInMB: (validFile.size / (1024 * 1024)).toFixed(2),
      },
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to read file info',
    };
  }
}

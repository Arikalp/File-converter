/**
 * Image Conversion Utility using Sharp
 * 
 * Sharp is a high-performance Node.js image processing library.
 * It's built on libvips and is significantly faster than alternatives like ImageMagick.
 * 
 * Key Features:
 * - Fast processing using SIMD instructions
 * - Low memory footprint
 * - Supports multiple formats
 * - Thread-safe for concurrent operations
 * 
 * Performance Considerations:
 * - Sharp processes images in streams, reducing memory usage
 * - Suitable for serverless environments (Vercel)
 * - Can handle multiple conversions concurrently
 */

import sharp from 'sharp';
import { ConversionOptions, SupportedFormat } from './types';
import { DEFAULT_QUALITY } from './constants';

/**
 * Converts an image buffer to the specified format using Sharp
 * 
 * Process Flow:
 * 1. Create Sharp instance from input buffer
 * 2. Apply format-specific conversion options
 * 3. Process image and return output buffer
 * 
 * Important Notes:
 * - SVG to Raster: This is a true conversion (vector → pixels)
 * - Raster to SVG: NOT SUPPORTED - cannot vectorize raster images
 *   (Would require AI/ML-based tracing, not a simple conversion)
 * 
 * @param inputBuffer - The source image as a Buffer or Uint8Array
 * @param options - Conversion options including target format and quality
 * @returns Promise resolving to converted image buffer
 * @throws Error if conversion fails or format is unsupported
 */
export async function convertImage(
  inputBuffer: Buffer | Uint8Array,
  options: ConversionOptions
): Promise<Buffer> {
  try {
    // Initialize Sharp instance with the input buffer
    // Sharp automatically detects the input format
    let image = sharp(inputBuffer);

    // Extract conversion options with defaults
    const { format, quality = DEFAULT_QUALITY, width, height, fit = 'inside' } = options;

    // Apply resizing if dimensions are specified
    // This is useful for creating thumbnails or optimizing for web
    if (width || height) {
      image = image.resize(width, height, {
        fit, // How to fit the image: cover, contain, fill, inside, outside
        withoutEnlargement: true, // Don't upscale images (prevents quality loss)
      });
    }

    // Apply format-specific conversion with optimized settings
    // Each format has different characteristics and optimization strategies
    switch (format) {
      case 'jpeg':
      case 'jpg':
        // JPEG: Lossy compression, best for photographs
        // Quality 80-90 provides good balance between size and quality
        return await image
          .jpeg({
            quality, // Compression quality (1-100)
            progressive: true, // Progressive rendering for better UX
            mozjpeg: true, // Use MozJPEG for better compression
          })
          .toBuffer();

      case 'png':
        // PNG: Lossless compression, supports transparency
        // compressionLevel affects processing time vs file size
        return await image
          .png({
            compressionLevel: 9, // Maximum compression (0-9)
            progressive: true,
            palette: true, // Use palette-based encoding when possible (smaller size)
          })
          .toBuffer();

      case 'webp':
        // WebP: Modern format with superior compression (supports both lossy and lossless)
        // Provides 25-35% better compression than JPEG at same quality
        return await image
          .webp({
            quality,
            lossless: quality === 100, // Use lossless mode for quality=100
            nearLossless: quality > 90, // Near-lossless for high quality settings
            effort: 6, // Compression effort (0-6), higher = better compression but slower
          })
          .toBuffer();

      case 'avif':
        // AVIF: Next-generation format with excellent compression
        // ~50% better compression than JPEG, but slower encoding
        // Note: Limited browser support (check caniuse.com)
        return await image
          .avif({
            quality,
            effort: 4, // Encoding effort (0-9), balanced setting for production
            chromaSubsampling: '4:4:4', // Best quality color sampling
          })
          .toBuffer();

      case 'tiff':
        // TIFF: High-quality format for professional use
        // Larger file sizes but preserves maximum quality
        return await image
          .tiff({
            quality,
            compression: 'lzw', // Lossless LZW compression
          })
          .toBuffer();

      case 'gif':
        // GIF: Limited color palette (256 colors), supports animation
        // Note: Sharp only converts first frame of animated GIFs
        return await image
          .gif({
            colors: 256, // Maximum colors for GIF
          })
          .toBuffer();

      default:
        // TypeScript should catch this, but defensive programming
        throw new Error(`Unsupported format: ${format}`);
    }
  } catch (error) {
    // Log error for debugging (in production, use proper logging service)
    console.error('Image conversion error:', error);
    
    // Re-throw with user-friendly message
    throw new Error(
      `Failed to convert image: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Gets metadata from an image buffer without processing it
 * Useful for displaying original image information to users
 * 
 * @param inputBuffer - The source image buffer
 * @returns Promise resolving to image metadata
 */
export async function getImageMetadata(inputBuffer: Buffer | Uint8Array) {
  try {
    const metadata = await sharp(inputBuffer).metadata();
    
    return {
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      space: metadata.space,
      channels: metadata.channels,
      depth: metadata.depth,
      density: metadata.density,
      hasAlpha: metadata.hasAlpha,
      size: metadata.size,
    };
  } catch (error) {
    console.error('Error reading image metadata:', error);
    throw new Error('Failed to read image metadata');
  }
}

/**
 * Generates a file extension based on the format
 * 
 * @param format - The target format
 * @returns File extension with dot prefix
 */
export function getFileExtension(format: SupportedFormat): string {
  const extensions: Record<SupportedFormat, string> = {
    jpeg: '.jpg',
    jpg: '.jpg',
    png: '.png',
    webp: '.webp',
    avif: '.avif',
    tiff: '.tiff',
    gif: '.gif',
  };
  
  return extensions[format] || '.jpg';
}

/**
 * Gets MIME type for a given format
 * 
 * @param format - The image format
 * @returns MIME type string
 */
export function getMimeType(format: SupportedFormat): string {
  const mimeTypes: Record<SupportedFormat, string> = {
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    avif: 'image/avif',
    tiff: 'image/tiff',
    gif: 'image/gif',
  };
  
  return mimeTypes[format] || 'image/jpeg';
}

# 🎨 File Converter

A production-ready web application for converting image files between different formats. Built with Next.js App Router, TypeScript, and Sharp for high-performance image processing.

![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4+-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

## ✨ Features

- 🚀 **High-Performance Conversion** - Uses Sharp (libvips) for fast image processing
- 🔒 **Secure Upload Handling** - File size limits, MIME type validation, filename sanitization
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎯 **Drag & Drop** - Intuitive file upload with drag-and-drop support
- 🎨 **Modern UI** - Clean interface built with Tailwind CSS
- ⚡ **Server-Side Processing** - Leverages Next.js Server Actions
- 🌐 **Edge-Ready** - Optimized for deployment on Vercel
- 💯 **Type-Safe** - Fully written in TypeScript with strict mode

## 🖼️ Supported Formats

Convert between the following image formats:

- **JPEG/JPG** - Lossy compression, best for photos
- **PNG** - Lossless compression, supports transparency
- **WebP** - Modern format with excellent compression
- **AVIF** - Next-gen format with superior compression
- **TIFF** - High-quality format for professional use
- **GIF** - Supports animation (first frame only)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/file-converter.git
   cd file-converter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:5000](http://localhost:5000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
file-converter/
├── app/                    # Next.js App Router
│   ├── actions/           # Server Actions
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── FileUpload.tsx
│   ├── FormatSelector.tsx
│   └── QualitySlider.tsx
├── lib/                   # Utilities & business logic
│   ├── constants.ts
│   ├── converter.ts
│   ├── types.ts
│   └── validation.ts
└── public/               # Static assets
```

For detailed architecture documentation, see [ARCHITECTURE.md](ARCHITECTURE.md).

## 🛠️ Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router)
- **Language:** [TypeScript 5+](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Image Processing:** [Sharp](https://sharp.pixelplumbing.com/)
- **Deployment:** [Vercel](https://vercel.com/)

## 🔒 Security Features

- ✅ File size validation (10MB limit)
- ✅ MIME type whitelisting
- ✅ Filename sanitization
- ✅ Server-side validation
- ✅ No persistent file storage
- ✅ XSS protection
- ✅ Path traversal prevention

## 📊 Performance

- **Sharp Processing:** 10x faster than ImageMagick
- **Server Actions:** Reduced API overhead
- **Progressive Loading:** Better perceived performance
- **Optimized Compression:** WebP/AVIF support for smaller files
- **Edge Deployment:** Low latency via Vercel's edge network

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/file-converter)

Or manually:

1. Push code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/new)
3. Deploy (zero configuration needed)

### Environment Variables

No environment variables required for basic functionality.

## 📝 Usage Example

```typescript
// Using the conversion API (Server Action)
const formData = new FormData();
formData.append('file', imageFile);
formData.append('targetFormat', 'webp');
formData.append('quality', '90');

const result = await convertFile(formData);
// result contains converted file data
```

## ⚠️ Limitations

- **Raster to Vector:** Cannot convert PNG/JPG to SVG (requires AI-based vectorization)
- **Animated GIFs:** Only first frame is converted
- **File Size:** Maximum 10MB upload (configurable)
- **Processing Time:** Large files may take several seconds

See [ARCHITECTURE.md](ARCHITECTURE.md#conversion-limitations) for detailed limitations.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Sharp](https://sharp.pixelplumbing.com/) - High-performance image processing
- [Next.js](https://nextjs.org/) - React framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

## 📞 Support

For questions or issues:
- Open an [issue](https://github.com/yourusername/file-converter/issues)
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for detailed documentation

---

**Built with ❤️ using Next.js, TypeScript, and Sharp**

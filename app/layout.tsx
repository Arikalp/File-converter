import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "File Converter - Free Online Image Converter | PNG, JPG, WEBP, AVIF",
    template: "%s | File Converter",
  },
  description: "Free online image converter. Convert PNG, JPG, JPEG, WEBP, AVIF, TIFF, and GIF images instantly. Fast, secure, and easy to use. No registration required. Convert images with quality control and resizing options.",
  keywords: [
    "image converter",
    "file converter",
    "png to jpg",
    "jpg to png",
    "webp converter",
    "avif converter",
    "image format converter",
    "online converter",
    "free image converter",
    "convert images online",
    "image resizer",
    "compress images",
  ],
  authors: [{ name: "Sankalp" }],
  creator: "Sankalp",
  publisher: "Sankalp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://file-converter.vercel.app',
    siteName: 'File Converter',
    title: 'File Converter - Free Online Image Converter',
    description: 'Convert PNG, JPG, WEBP, AVIF, TIFF, and GIF images instantly. Fast, secure, and free image conversion tool.',
    images: [
      {
        url: '/icon.svg',
        width: 64,
        height: 64,
        alt: 'File Converter Icon',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'File Converter - Free Online Image Converter',
    description: 'Convert images between formats instantly. PNG, JPG, WEBP, AVIF, TIFF, GIF. Free and secure.',
    creator: '@sankalp',
    images: ['/icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#3B82F6" />
        <link rel="canonical" href="https://file-converter.vercel.app" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

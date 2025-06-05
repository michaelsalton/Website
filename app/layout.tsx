import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Michael Salton',
  description: 'Computer Graphics & Real-time Rendering',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-theme-darker text-theme-light min-h-screen`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
} 
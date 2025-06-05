import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';

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
        <main>
          <div className="h-screen">
            <Hero />
          </div>
          <div className="relative z-10 bg-theme-darker">
            <About />
            <Projects />
            <Contact />
          </div>
        </main>
      </body>
    </html>
  );
} 
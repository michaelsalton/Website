import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Image from 'next/image';
import SimulationsGrid from './components/SimulationsGrid';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Portfolio | Computer Graphics & Real-time Rendering',
  description: 'Portfolio showcasing expertise in computer graphics, real-time rendering, and interactive 3D applications.',
};

export default function Home() {
  return (
    <main className={`min-h-screen ${inter.className}`}>
      <div className="relative z-10">
        <Hero />
        <About />
        <div className="w-full py-12 bg-black">
          <div className="container mx-auto px-4">
            <SimulationsGrid />
          </div>
        </div>
        <Projects />
        <Contact />
      </div>
    </main>
  );
} 
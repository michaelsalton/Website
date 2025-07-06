import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ScrollIndicator from './components/ScrollIndicator';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Michael Salton',
  description: 'Portfolio showcasing expertise in computer graphics, real-time rendering, and interactive 3D applications.',
};

export default function Home() {
  return (
    <main className={`h-screen ${inter.className} snap-y snap-mandatory overflow-y-scroll`}>
      <div className="relative z-10 h-full">
        <ScrollIndicator />
        <Hero />
        <About />
        <Projects />
        <Contact />
      </div>
    </main>
  );
} 
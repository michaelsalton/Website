import DottedBackground from './components/DottedBackground';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Goals from './components/Goals';
import Contact from './components/Contact';

export default function Home() {
  return (
    <>
      <DottedBackground />
      <Navigation />
      <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">
        <Hero />
        <About />
        <Projects />
        <Goals />
        <Contact />
      </div>
    </>
  );
} 
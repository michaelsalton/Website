import Image from 'next/image';
import Link from 'next/link';
import DottedBackground from '../../components/DottedBackground';
import Navigation from '../../components/Navigation';

export const metadata = {
  title: 'misanthrope - Michael Salton',
  description: 'A game blending 3D and 2D elements with a unique sketchbook aesthetic, featuring procedural placement, toon shaders, and dynamic day/night cycle.',
};

const features = [
  {
    title: 'Sketchbook Aesthetic',
    description: 'A distinctive visual style that blends 3D environments with 2D elements, creating a hand-drawn sketchbook look.',
  },
  {
    title: 'Exploration & Collectibles',
    description: 'A level filled with collectibles that change the ending — some visible, some hidden in off-path routes. Multiple endings encourage replayability.',
  },
  {
    title: 'Rotatable Camera',
    description: 'Players can rotate the camera to reveal hidden paths and view the world from new angles, rewarding curiosity.',
  },
  {
    title: '3-Hit Combat',
    description: 'A 3-hit melee combo with timing depth — spam for rapid attacks, or time inputs to extend the combo and cancel into a dash.',
  },
  {
    title: 'Dash Mechanic',
    description: 'A dash ability (Space) doubles as a movement and combat tool, letting players evade enemies or close gaps quickly.',
  },
  {
    title: 'Poisson Disc Placement',
    description: 'Procedural object placement using Poisson Disc Sampling — natural, gap-free distribution without grid artifacts.',
  },
  {
    title: 'Dynamic Day/Night Cycle',
    description: 'Real-time sky and lighting transitions shift the mood of the world as time passes.',
  },
  {
    title: 'Custom Toon Shaders',
    description: 'Hand-crafted toon shaders reinforce the stylized sketchbook aesthetic across all characters and environments.',
  },
  {
    title: 'Audio Design',
    description: 'Full audio implementation: combo swing sounds, randomized footsteps, dash SFX, enemy spawn animations with audio, and ambient sound instead of music.',
  },
];

export default function MisanthropePage() {
  return (
    <>
      <DottedBackground />
      <Navigation />
      <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">

        {/* Hero */}
        <div className="relative w-full h-[40vh] md:h-[52vh] overflow-hidden">
          <Image
            src="/images/mis.png"
            alt="misanthrope"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 w-full max-w-4xl mx-auto px-6 pb-8">
            <p className="font-mono text-[11px] tracking-widest text-[var(--accent)] mb-3 uppercase">
              Game Development · Unity · C#
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">misanthrope</h1>
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              A 3D/2D Hybrid Game with a Sketchbook Aesthetic
            </p>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-6">

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-8 mb-12">
            <a
              href="https://github.com/michaelsalton/misanthrope"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-4 py-2 border border-[var(--border)] rounded-sm hover:border-[var(--accent)] no-underline"
            >
              GitHub →
            </a>
          </div>

          {/* Overview */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Overview</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              misanthrope is a game built with <span className="text-[var(--text-primary)]">Benjamin Oliveria and Michael Salton</span> that blends 3D environments with 2D elements to create a distinctive sketchbook aesthetic. Players control Timon through a demo level filled with collectibles, branching paths, and enemies — with the ending determined by how much they explore.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              The project prioritizes feel and polish: a 3-hit combo with timing depth, a rotatable camera for exploration, full audio design for every interaction, and procedural object placement using Poisson Disc Sampling — all wrapped in a hand-crafted visual style driven by custom toon shaders.
            </p>
          </section>

          {/* Features */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Features</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px border border-[var(--border)] rounded-sm overflow-hidden">
              {features.map((f) => (
                <div key={f.title} className="bg-[var(--bg-sidebar)] p-5">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{f.title}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tech */}
          <section className="mb-16">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Technology</h2>
            <div className="flex flex-wrap gap-2">
              {['Unity', 'C#', 'GLSL', 'Game Development'].map((t) => (
                <span key={t} className="text-xs px-3 py-1.5 rounded-sm border border-[var(--border)] text-[var(--text-secondary)]">{t}</span>
              ))}
            </div>
          </section>

          {/* Back */}
          <div className="pb-12">
            <Link
              href="/projects"
              className="inline-block text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-underline"
            >
              ← All projects
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}

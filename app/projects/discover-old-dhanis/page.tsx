import Image from 'next/image';
import Link from 'next/link';
import DottedBackground from '../../components/DottedBackground';
import Navigation from '../../components/Navigation';

export const metadata = {
  title: "Discover Old D'Hanis - Michael Salton",
  description: "An interactive historical exploration game set in the 19th-century Texas town of Old D'Hanis, built with Unity and photogrammetry.",
};

const features = [
  {
    title: 'Photogrammetry',
    description: "Real-world artifacts and locations from Old D'Hanis digitized using photogrammetry and integrated into the game world.",
  },
  {
    title: 'Archival Research',
    description: 'Historical records, archaeological photos, and oral histories woven into the narrative experience.',
  },
  {
    title: 'Multiple Communities',
    description: "Stories spanning Alsatian and German settlers (1847), Black communities, and Mexican families — the full social fabric of Old D'Hanis.",
  },
  {
    title: 'Exploration',
    description: 'Open-ended exploration of a reconstructed 19th-century Texas town with discoverable story fragments.',
  },
  {
    title: 'Educational Design',
    description: 'Designed in collaboration with historians and community members to preserve and share authentic local history.',
  },
  {
    title: 'Steam Release',
    description: 'Published on Steam as a standalone title, bringing local Texas history to a global audience.',
  },
];

export default function DiscoverOldDHanisPage() {
  return (
    <>
      <DottedBackground />
      <Navigation />
      <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">

        {/* Hero */}
        <div className="relative w-full h-[40vh] md:h-[52vh] overflow-hidden">
          <Image
            src="/images/dod.jpg"
            alt="Discover Old D'Hanis"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 w-full max-w-4xl mx-auto px-6 pb-8">
            <p className="font-mono text-[11px] tracking-widest text-[var(--accent)] mb-3 uppercase">
              Game Development · Unity · 2025
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">Discover Old D&#39;Hanis</h1>
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              An Interactive Historical Exploration of a 19th-Century Texas Town
            </p>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-6">

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-8 mb-12">
            <a
              href="https://store.steampowered.com/app/3140860/Discover_Old_DHanis/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-4 py-2 border border-[var(--border)] rounded-sm hover:border-[var(--accent)] no-underline"
            >
              Steam →
            </a>
            <a
              href="https://www.discoverolddhanis.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-4 py-2 border border-[var(--border)] rounded-sm hover:border-[var(--accent)] no-underline"
            >
              Website →
            </a>
          </div>

          {/* Overview */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Overview</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              Discover Old D&#39;Hanis is an interactive historical exploration game that brings the story of a forgotten 19th-century Texas town back to life. Players step into the past and piece together the town&#39;s history through <span className="text-[var(--text-primary)]">archival fragments, archaeological photos, and oral histories</span>.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              The game covers the full social history of Old D&#39;Hanis — from the Alsatian and German settlers who founded the town in 1847, to the Black and Mexican families who shaped its community after the Civil War. Built with Unity and photogrammetry, it blends rigorous historical research with interactive storytelling.
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
              {['Unity', 'C#', 'Photogrammetry', 'Game Development'].map((t) => (
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

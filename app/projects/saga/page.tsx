import Image from 'next/image';
import Link from 'next/link';
import DottedBackground from '../../components/DottedBackground';
import Navigation from '../../components/Navigation';

export const metadata = {
  title: 'Saga - Michael Salton',
  description: 'A survival game set in Iceland during the Saga Age, inspired by the Sagas of Icelanders.',
};

const features = [
  {
    title: 'Open-World Exploration',
    description: 'Explore a recreated Icelandic landscape during the Saga Age — fjords, volcanic terrain, and Norse settlements.',
  },
  {
    title: 'Resource Gathering',
    description: 'Collect wood, stone, food, and other materials from the environment to sustain your character and grow your settlement.',
  },
  {
    title: 'Settlement Management',
    description: 'Build and manage a Viking settlement, making decisions that affect its growth, morale, and survival through harsh winters.',
  },
  {
    title: 'Saga-Inspired Stories',
    description: "Narrative events and quests drawn from the Sagas of Icelanders — the original Norse prose literature describing the lives of early Icelandic settlers.",
  },
  {
    title: 'Survival Mechanics',
    description: 'Manage hunger, warmth, and resources through Iceland\'s unforgiving seasons.',
  },
  {
    title: 'Historical Setting',
    description: 'Grounded in the Commonwealth Period of Iceland (930–1262 AD) — a time of clan politics, exploration, and saga tradition.',
  },
];

export default function SagaPage() {
  return (
    <>
      <DottedBackground />
      <Navigation />
      <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">

        {/* Hero */}
        <div className="relative w-full h-[40vh] md:h-[52vh] overflow-hidden">
          <Image
            src="/images/saga.png"
            alt="Saga"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 w-full max-w-4xl mx-auto px-6 pb-8">
            <p className="font-mono text-[11px] tracking-widest text-[var(--accent)] mb-3 uppercase">
              Game Development · Unity · C#
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">Saga</h1>
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              A Survival Game Set in Viking-Age Iceland
            </p>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-6">

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-8 mb-12">
            <a
              href="https://github.com/michaelsalton/Saga"
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
              Saga is a survival game set in <span className="text-[var(--text-primary)]">Iceland during the Saga Age</span> — the Commonwealth Period of 930–1262 AD. Players arrive as early Norse settlers and must explore the land, gather resources, build a settlement, and navigate stories drawn directly from the Sagas of Icelanders.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              The Sagas of Icelanders are the original Old Norse prose narratives describing the lives, conflicts, and journeys of real historical figures. Saga uses these stories as the foundation for its quests and events, grounding the game in authentic Norse culture and history.
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
              {['Unity', 'C#', 'Game Development'].map((t) => (
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

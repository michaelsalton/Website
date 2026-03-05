import Image from 'next/image';
import Link from 'next/link';
import DottedBackground from '../../components/DottedBackground';
import Navigation from '../../components/Navigation';

export const metadata = {
  title: 'Project Lambda - Michael Salton',
  description: 'Two AI agents built to play Counter-Strike: Global Offensive using computer vision, pathfinding, and deep reinforcement learning.',
};

const agents = [
  {
    name: 'Agent 1 — Vision + Pathfinding',
    description: 'Combines YOLOv7 object detection with A* pathfinding. Detects players and game objects from raw screen pixels, then navigates the map using classical graph search.',
    tags: ['YOLOv7', 'A* Pathfinding', 'Computer Vision'],
  },
  {
    name: 'Agent 2 — Behavioural Cloning',
    description: 'A deep neural network trained on professional CS:GO match footage using behavioural cloning and offline reinforcement learning. Operates purely on visual input — no game memory access.',
    tags: ['Deep Learning', 'Behavioural Cloning', 'Offline RL'],
  },
];

const features = [
  {
    title: 'Vision-Only Input',
    description: 'Both agents rely exclusively on screen pixels — no memory reading, no game API hooks. Mirrors how human players perceive the game.',
  },
  {
    title: 'Professional Data Training',
    description: 'Agent 2 was trained on a large dataset of professional CS:GO gameplay footage, learning movement, aim, and positioning strategies.',
  },
  {
    title: 'Behavioural Comparison',
    description: 'The core research question: does an AI built with pathfinding behave more or less realistically than one trained end-to-end from human footage?',
  },
  {
    title: 'OpenAI Gym Integration',
    description: 'Game environment wrapped as an OpenAI Gym interface for standardized agent training and evaluation.',
  },
];

export default function ProjectLambdaPage() {
  return (
    <>
      <DottedBackground />
      <Navigation />
      <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">

        {/* Hero */}
        <div className="relative w-full h-[40vh] md:h-[52vh] overflow-hidden">
          <Image
            src="/images/cs.jpg"
            alt="Project Lambda"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 w-full max-w-4xl mx-auto px-6 pb-8">
            <p className="font-mono text-[11px] tracking-widest text-[var(--accent)] mb-3 uppercase">
              AI · Reinforcement Learning · Python
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">Project Lambda</h1>
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              AI Agents Playing Counter-Strike Using Only Visual Input
            </p>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-6">

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-8 mb-12">
            <a
              href="https://github.com/michaelsalton/ProjectLambda"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-4 py-2 border border-[var(--border)] rounded-sm hover:border-[var(--accent)] no-underline"
            >
              GitHub →
            </a>
            <a
              href="https://www.youtube.com/watch?v=huGKr469u5g"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-4 py-2 border border-[var(--border)] rounded-sm hover:border-[var(--accent)] no-underline"
            >
              Video Demo →
            </a>
            <a
              href="https://github.com/michaelsalton/ProjectLambda/blob/main/Comparing_AI_Navigation_Methods_Using_Counter_Strike__Global_Offensive.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-4 py-2 border border-[var(--border)] rounded-sm hover:border-[var(--accent)] no-underline"
            >
              Paper →
            </a>
          </div>

          {/* Overview */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Overview</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              Project Lambda builds two AI agents that play Counter-Strike: Global Offensive using <span className="text-[var(--text-primary)]">only visual input from the screen</span>. Unlike traditional aim-bots that read game memory to get player coordinates, these agents perceive and react to the game exactly as a human would — through pixels alone.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              The project compares two fundamentally different AI approaches: classical computer vision with graph-based pathfinding, versus a deep neural network trained end-to-end on professional gameplay footage using behavioural cloning and offline reinforcement learning.
            </p>
          </section>

          {/* Agents */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Agents</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {agents.map((a) => (
                <div key={a.name} className="border border-[var(--border)] rounded-sm p-5">
                  <p className="text-xs font-mono tracking-widest text-[var(--accent)] mb-3">{a.name.split('—')[0].trim()}</p>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">{a.name.split('—')[1]?.trim()}</h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">{a.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {a.tags.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-sm border border-[var(--border)] text-[var(--text-secondary)]">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Key Aspects</h2>
            <div className="grid sm:grid-cols-2 gap-px border border-[var(--border)] rounded-sm overflow-hidden">
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
              {['Python', 'PyTorch', 'YOLOv7', 'OpenAI Gym', 'Behavioural Cloning', 'Offline RL'].map((t) => (
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

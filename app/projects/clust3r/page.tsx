import Image from 'next/image';
import Link from 'next/link';
import DottedBackground from '../../components/DottedBackground';
import Navigation from '../../components/Navigation';

export const metadata = {
  title: 'CLUST3R - Michael Salton',
  description: 'GPU-accelerated spatial clustering library for 3D Gaussian Splatting assets using k-means|| with spatial hashing and adaptive rebalancing.',
};

const features = [
  {
    title: 'K-means|| Clustering',
    description: 'Parallel k-means++ initialization with O(log k)-competitive guarantees. Significantly faster convergence than standard k-means initialization.',
  },
  {
    title: 'Spatial Hash Grid',
    description: 'O(1) neighbor queries via parallel hash grid construction using cell assignment, prefix sum, and compaction.',
  },
  {
    title: 'Adaptive Rebalancing',
    description: 'Automatically merges underweight clusters and splits overweight ones after convergence, ensuring balanced partitions.',
  },
  {
    title: 'Fully GPU-Accelerated',
    description: 'All four pipeline stages run entirely on GPU via CUDA. No CPU-GPU data transfers during clustering.',
  },
  {
    title: 'GEODE Integration',
    description: 'Designed as a preprocessing step for the GEODE pipeline — partitions 3DGS scenes into clusters for downstream classification.',
  },
  {
    title: 'Configurable',
    description: 'Tunable target cluster size, max iterations, and convergence tolerance. Scales from 50K game assets to 10M+ primitive full scenes.',
  },
];

const performance = [
  { scale: 'Game Asset', count: '50K', target: '< 50ms', memory: '< 100MB' },
  { scale: 'Medium Scene', count: '500K', target: '< 500ms', memory: '< 500MB' },
  { scale: 'Full Scene', count: '1M', target: '< 2s', memory: '< 1GB' },
  { scale: 'Large Scene', count: '10M', target: '< 20s', memory: '< 4GB' },
];

const pipelineStages = [
  {
    stage: '1',
    title: 'Spatial Hash Grid',
    description: 'Assigns each Gaussian to a hash cell, computes prefix sums, and compacts the data structure for O(1) neighbor lookups.',
  },
  {
    stage: '2',
    title: 'K-means|| Initialization',
    description: 'Parallel seeding over O(log n) rounds with competitive approximation guarantees — avoids the poor initializations of naive k-means++.',
  },
  {
    stage: '3',
    title: 'K-means Iteration',
    description: 'Repeated assignment and centroid update passes until convergence tolerance is met or max iterations reached.',
  },
  {
    stage: '4',
    title: 'Rebalance Engine',
    description: 'Post-convergence merge/split pass that enforces cluster size constraints for downstream analysis compatibility.',
  },
];

const codeExample = `clust3r::ClusterConfig config;
config.target_cluster_size = 2000;
config.max_iterations      = 50;
config.convergence_tolerance = 1e-5f;

clust3r::Clusterer clusterer(config);
auto result = clusterer.cluster(positions, count);

// result.assignments  — cluster ID per primitive
// result.clusters     — vector of Cluster structs
// result.elapsed_ms   — total runtime`;

export default function Clust3rPage() {
  return (
    <>
      <DottedBackground />
      <Navigation />
      <div className="min-h-screen overflow-x-hidden pb-20 md:pb-0">

        {/* Hero */}
        <div className="relative w-full h-[40vh] md:h-[52vh] overflow-hidden bg-[var(--bg-sidebar)]">
          <Image
            src="/images/3dgs.png"
            alt="CLUST3R"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 w-full max-w-4xl mx-auto px-6 pb-8">
            <p className="font-mono text-[11px] tracking-widest text-[var(--accent)] mb-3 uppercase">
              Graphics · CUDA · 2026
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">CLUST3R</h1>
            <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
              GPU-Accelerated Spatial Clustering for 3D Gaussian Splatting
            </p>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-6">

          {/* Links */}
          <div className="flex flex-wrap gap-3 mt-8 mb-12">
            <a
              href="https://github.com/michaelsalton/Clust3r"
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
              CLUST3R is a GPU-accelerated spatial clustering library for <span className="text-[var(--text-primary)]">3D Gaussian Splatting</span> scenes. It implements k-means|| — parallel k-means++ — with a spatial hash grid for O(1) neighbor queries and an adaptive rebalancing engine that merges and splits clusters post-convergence.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Designed as a preprocessing stage for the GEODE pipeline, CLUST3R partitions large 3DGS scenes into spatially coherent clusters for downstream classification and analysis. All stages run entirely on GPU — no CPU-GPU transfers during clustering. Developed at Concordia University as part of a High-Performance C++/CUDA Reading Course.
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

          {/* Pipeline */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Pipeline</h2>
            <div className="space-y-px">
              {pipelineStages.map((s) => (
                <div key={s.stage} className="grid grid-cols-[48px_1fr] gap-4 bg-[var(--bg-sidebar)] border border-[var(--border)] px-5 py-4">
                  <span className="font-mono text-xs text-[var(--accent)] pt-0.5">0{s.stage}</span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">{s.title}</p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Performance */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Performance Targets</h2>
            <div className="border border-[var(--border)] rounded-sm overflow-hidden">
              <div className="grid grid-cols-4 gap-4 px-5 py-3 border-b border-[var(--border)] bg-[var(--bg-sidebar)]">
                {['Scale', 'Primitives', 'Target Time', 'Memory'].map((h) => (
                  <span key={h} className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase">{h}</span>
                ))}
              </div>
              {performance.map((row, i) => (
                <div
                  key={row.scale}
                  className={`grid grid-cols-4 gap-4 px-5 py-3 text-sm ${i < performance.length - 1 ? 'border-b border-[var(--border)]' : ''}`}
                >
                  <span className="text-[var(--text-primary)]">{row.scale}</span>
                  <span className="text-[var(--text-secondary)] font-mono">{row.count}</span>
                  <span className="text-[var(--accent)] font-mono">{row.target}</span>
                  <span className="text-[var(--text-secondary)] font-mono">{row.memory}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Usage */}
          <section className="mb-14">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Usage</h2>
            <pre className="bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-sm p-5 overflow-x-auto text-xs text-[var(--text-secondary)] leading-relaxed font-mono">
              {codeExample}
            </pre>
          </section>

          {/* Requirements */}
          <section className="mb-16">
            <h2 className="text-xs font-mono tracking-widest text-[var(--text-secondary)] uppercase mb-5">Requirements</h2>
            <div className="flex flex-wrap gap-2">
              {['CUDA Toolkit 11.0+', 'CMake 3.18+', 'C++17', 'CUB Library'].map((t) => (
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

export default function Goals() {
  const interests = [
    'Real-time Ray Tracing',
    'Neural Rendering',
    '3D Gaussian Splatting',
    'Physically Based Rendering',
    'GPU Architecture',
    'CUDA Programming',
    'Shader Development',
    'Photogrammetry'
  ];

  return (
    <section className="w-full max-w-4xl mx-auto px-6 pb-12">
      <h2 className="font-mono text-[11px] tracking-widest uppercase text-[var(--text-secondary)] mb-6">
        Areas of Interest
      </h2>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest) => (
          <span
            key={interest}
            className="text-sm px-3 py-1.5 rounded-sm border border-[var(--border)]"
          >
            {interest}
          </span>
        ))}
      </div>
    </section>
  );
}

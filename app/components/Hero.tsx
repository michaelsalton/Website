import Image from 'next/image';

export default function Hero() {
  return (
    <section className="w-full max-w-[1800px] mx-auto">
      <Image
        src="/images/dhanis_banner.jpg"
        alt="Michael Salton — banner photo"
        width={1800}
        height={450}
        className="w-full object-cover h-[300px] md:h-[450px] !mt-0"
        style={{ objectPosition: 'center 30%' }}
        priority
      />
    </section>
  );
} 
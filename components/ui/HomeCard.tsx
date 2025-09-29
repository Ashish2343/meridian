'use client';

import Image from 'next/image';

import { cn } from '@/lib/utils';
import { useState } from 'react';

interface HomeCardProps {
  className?: string;
  img: string;
  title: string;
  description: string;
  handleClick?: () => void;
}

const HomeCard = ({ className, img, title, description, handleClick }: HomeCardProps) => {
  const [isActive, setIsActive] = useState(false);

  const handleCardClick = () => {
    setIsActive(true);
    handleClick?.();

    // Remove glow after 300ms for click feedback only
    setTimeout(() => setIsActive(false), 300);
  };

  return (
    <section
      className={cn(
        `relative overflow-hidden 
     px-6 py-8 flex flex-col justify-between 
     w-full xl:max-w-[480px] min-h-[280px] 
     rounded-2xl
     bg-gradient-to-b from-zinc-900/60 to-zinc-950/90
     border border-white/10
     backdrop-blur-md
     hover:scale-[1.03]
     hover:shadow-[0_0_50px_-10px_rgba(99,102,241,0.4)]
     transition-all duration-300 ease-out
     cursor-pointer`,
        className 
      )}
      onClick={handleClick}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image src="/icons/dotted.svg" fill alt="grid" className="object-cover"/>
      </div>
      <div className="relative flex items-center justify-center size-12  rounded-[10px]
    hover:backdrop-blur-md hover:bg-white/10 transition">

  <Image src={img} alt="meeting" width={34} height={34} />
</div>
      
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-lg font-normal">{description}</p>
      </div>
    </section>
  );
};

export default HomeCard;
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
        `bg-black border border-[#3f3f46]
        relative overflow-hidden
          px-4 py-6
         flex flex-col  
         justify-between 
         w-full xl:max-w-[480px] min-h-[270px] 
         rounded-[14px]
         hover:scale-105
         hover:border-white 
         hover:shadow-[0_0_40px_10px_rgba(255,255,255,0.15)]
         inset_0_0_20px_rgba(255,255,255,0.05)]
         hover:ring-1 
         hover:ring-white/30
         transition-transform duration-200 ease-out
        cursor-pointer `,
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
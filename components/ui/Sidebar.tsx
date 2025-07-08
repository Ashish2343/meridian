'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <section className="sticky  left-0 
    hover:shadow-[0_0_40px_10px_rgba(255,255,255,0.15)]
         inset_0_0_20px_rgba(255,255,255,0.05)]
         hover:ring-white/30
        top-0 flex h-screen w-fit flex-col justify-between p-6 pt-28 text-white max-sm:hidden lg:w-[264px]" style={{ backgroundColor: 'black' }}>
      <div className="flex flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          
          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
              'flex gap-4 items-center p-4 rounded-lg justify-start',
               isActive
                 ? `bg-black text-white `
              : `text-gray-400 
               hover:shadow-[0_0_40px_10px_rgba(255,255,255,0.15)]
              inset_0_0_20px_rgba(255,255,255,0.05)]
         hover:ring-1 
         hover:ring-white/30
                  hover:text-white transition-colors duration-200`,
              )}
            >
              <Image
                src={item.imgUrl}
                alt={item.label}
                width={24}
                height={24}
              />
              <p className="text-lg font-semibold max-lg:hidden">
                {item.label}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils';
import { sidebarLinks } from '@/constants';


const MobileNav = () => {
    const pathname = usePathname();
    return (
     <section className='w-full max-w-[264px]'>
        <Sheet>
        <SheetTrigger asChild>
            <Image
            src="/icons/hamburger.svg"
            width={36}
            height={36}
            alt="Menu"
            className='cursor-pointer sm:hidden'
            />
            </SheetTrigger>
            <SheetContent side='left' className='border-none bg-black border'>
            <SheetHeader>
            
                <Link href="/" className='flex items-center gap-1'>
                    <Image
                    src="/icons/logo.svg"
                    width={32}
                    height={32}
                    alt="Meridian Logo"
                    className='max-sm:size-10'
                    />
                    <p className='text-[26px] font-extrabold text-white'>meridian</p>
                    </Link>
                    <div className='flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto'>
                    <SheetClose asChild>
                        <section className='flex h-full flex-col gap-6 pt-16 text-white'>
                            {sidebarLinks.map((item) => {
                                const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);

                                return (
                                    <SheetClose asChild key={item.route}>
                                    <Link
                                    href={item.route}
                                    key={item.label}
                                    className={cn(
                                    'flex gap-4 items-center p-4 rounded-lg w-full max-w-60',
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
                                    width={20}
                                    height={20}
                                    />
                                    <p className="font-semibold">
                                        {item.label}
                                    </p>
                                    </Link>
                                    </SheetClose>
                                    );
                                })}
                            </section>
                        </SheetClose>
                    </div>
                    <SheetTitle></SheetTitle>
             </SheetHeader>
                </SheetContent>
            </Sheet>
        </section>
    )
}

export default MobileNav

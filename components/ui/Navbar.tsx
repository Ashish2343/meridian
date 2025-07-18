import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import MobileNav from './MobileNav'
import { SignedIn, UserButton } from '@clerk/nextjs'

const Navbar = () => {
  return (
    <nav className='flex flex-between fixed z-50 w-full bg-black border-b border-white px-6 py-3 lg:px-10'>
      <Link href="/" className='flex items-center gap-1'>
          <Image
            src="/icons/logo.svg"
            width={32}
            height={32}
            alt="Meridian Logo"
            className='max-sm:size-10'
          />
          <p className='text-[26px] font-extrabold text-white max-sm:hidden'>meridian</p>
      </Link>

      <div className='flex-between gap-5'>
        <SignedIn>
          <UserButton />
        </SignedIn>

          <MobileNav/>
      </div>
    </nav>
   
  )
}

export default Navbar

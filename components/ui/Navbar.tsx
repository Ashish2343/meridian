'use client'

import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, UserButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import MobileNav from './MobileNav'

const Navbar = () => {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex justify-between items-center fixed z-50 w-full
        bg-black/40 backdrop-blur-md border-b border-white/10
        px-6 py-3 lg:px-10 shadow-md"
    >
      {/* Logo + Brand */}
      <Link
        href="/"
        className="flex items-center gap-2 group transition"
      >
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Image
            src="/icons/video-calling.png"
            width={40}
            height={40}
            alt="Meridian Logo"
            className="max-sm:size-10"
          />
        </motion.div>
        <p
          className="text-[24px] font-extrabold text-white 
          max-sm:hidden tracking-wide group-hover:text-indigo-400 transition"
        >
          meridian
        </p>
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 border border-white/20 shadow-md hover:shadow-indigo-500/40 transition",
              },
            }}
          />
        </SignedIn>
        <MobileNav />
      </div>
    </motion.nav>
  )
}

export default Navbar

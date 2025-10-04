'use client'

import React, { useRef } from 'react'
import { TypeAnimation } from "react-type-animation";
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import { useRouter } from 'next/navigation'

/** ---------- Animation (typed & safe) ---------- */
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
}

/** ---------- Page ---------- */
const Home = () => {
  const router = useRouter();
  const aboutRef = useRef<HTMLDivElement>(null)
  const scrollToAbout = () => aboutRef.current?.scrollIntoView({ behavior: 'smooth' })

  type Feature = {
    title: string
    desc: string
    img: string
    ctas?: { label: string; href: string }[]
  }

  const features: Feature[] = [
    {
      title: '⚡ Move Faster, Ship Better',
      desc:
        'Cut through noise with a workspace designed for speed. Meridian keeps your team aligned without slowing you down.',
      img: 'https://images.unsplash.com/photo-1544829099-3103d99d7a5b?q=80&w=1600&auto=format&fit=crop',
      ctas: [
        { label: 'Learn more', href: '#' },
        { label: 'For enterprises', href: '#' },
      ],
    },
    {
      title: '💻 Built-in Code Editor',
      desc:
        'No more context switching. Collaborate, review, and ship code directly inside Meridian’s real-time editor.',
      img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1600&auto=format&fit=crop',
      ctas: [{ label: 'Docs', href: '#' }],
    },
    {
      title: '🎯 Radical Simplicity',
      desc:
        'Every feature reduces friction. Clean UI, intuitive navigation, zero clutter — so your team can focus.',
      img: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1600&auto=format&fit=crop',
      ctas: [{ label: 'Design principles', href: '#' }],
    },
    {
      title: '🔒 Trust & Transparency',
      desc:
        'Every decision, milestone, and change is logged and searchable, so your team never works in the dark.',
      img: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1600&auto=format&fit=crop',
      ctas: [{ label: 'Security', href: '#' }],
    },
    {
      title: '🌍 Open Source',
      desc:
        'Meridian is community-driven. Extend it, audit it, and make it your own — no vendor lock-in.',
      img: 'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1600&auto=format&fit=crop',
      ctas: [
        { label: 'GitHub', href: '#' },
        { label: 'Contributing', href: '#' },
      ],
    },
  ]

  return (
    <main className="flex min-h-screen flex-col bg-black text-white relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:22px_22px]" />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 md:py-36 gap-6">
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          src="https://source.unsplash.com/random/200x200?logo,abstract"
          alt="Meridian Logo"
          className="w-28 h-28 md:w-36 md:h-36 rounded-full border border-zinc-700 shadow-lg mb-6"
        />

        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="text-5xl md:text-6xl font-bold tracking-tight"
        >
          Meridian: <span className="text-indigo-400"><TypeAnimation
          sequence={[
            "Move Faster 🚀", // first text
            2000,             // wait 2s
            "Ship Better ⚡",  // second text
            2000,             
            "Build the Future 🌍", 
            2000,
          ]}
          wrapper="span"
          cursor={true}
          repeat={Infinity}
        /></span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="max-w-2xl text-lg md:text-xl text-zinc-400"
        >
          A modern workspace where collaboration, coding, and communication come together.
          Fast, simple, and transparent — built for the future of teams.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mt-6"
        >
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700" onClick={()=> router.push('/dashboard')}> 
            Get Started <ArrowRight className="ml-2 h-5 w-5"/>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-zinc-700 text-zinc-300 hover:bg-zinc-900"
            onClick={scrollToAbout}
          >
            Learn More
          </Button>
        </motion.div>
      </section>

      {/* Features — pro split layout */}
      <section ref={aboutRef} className="relative z-10 px-6 md:px-10 lg:px-20 py-10 md:py-8 space-y-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-10 md:py-14 border-t border-zinc-800"
          >
            {/* Text side */}
            <div className={`${i % 2 === 1 ? 'md:order-2' : ''}`}>
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-white">
                {f.title}
              </motion.h2>
              <motion.p variants={itemVariants} className="mt-4 text-lg text-zinc-400">
                {f.desc}
              </motion.p>
              {f.ctas && (
                <motion.div variants={itemVariants} className="mt-6 flex gap-6 text-indigo-400">
                  {f.ctas.map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      className="font-medium hover:underline underline-offset-4"
                    >
                      {c.label} →
                    </a>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Visual side */}
            <motion.div
              variants={itemVariants}
              className={`${i % 2 === 1 ? 'md:order-1' : ''} bg-zinc-900/60 rounded-xl border border-zinc-800 shadow-lg overflow-hidden`}
            >
              <img
                src={f.img}
                alt={f.title}
                className="w-full h-full object-cover aspect-[16/10]"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        ))}
      </section>

      {/* CTA — professional card */}
      <section className="relative z-10 px-6 md:px-10 lg:px-20 mt-10 mb-16">
        <div className="bg-white text-zinc-900 border border-zinc-200 rounded-2xl shadow-sm px-6 md:px-14 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform the way your team works?
          </h2>
          <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto mb-8">
            Collaborate, code, and communicate without barriers. Join thousands of teams building on
            Meridian.
          </p>
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg">
            Try Meridian Today <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-sm text-zinc-500 border-t border-zinc-800">
        © {new Date().getFullYear()} Meridian — Open source & built for teams.
      </footer>
    </main>
  )
}

export default Home

import React from 'react'
import Navbar from '@/components/ui/Navbar'
const Home = () => {
  return (
    <section className='flex size-full flex-col gap-10 text-white top-[50%] left-[50%] font-bold'>
    
      <h1 className='text-3xl flex-row '>
        Home landing page
        <Navbar />
      </h1>
    </section>
  )
}

export default Home

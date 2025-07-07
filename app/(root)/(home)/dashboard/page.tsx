'use client'

import React from 'react'
import MeetingTypeList from "@/components/ui/MeetingTypeList"

const Page = () => {
  //const [date, setDate] = React.useState<Date | undefined>(new Date())
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const date = (new Intl.DateTimeFormat('en-US', { dateStyle: 'full' })).format(now);

  return (
    <section className="flex size-full flex-col gap-5 text-white">
     < MeetingTypeList/>
      
    </section>
  )
}

export default Page

'use client'
import MeetingSetup from '@/components/ui/MeetingSetup';
import MeetingRoom from '@/components/ui/MeetingRoom';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import React, { use, useState } from 'react'
import { useGetCallById } from '@/hooks/useGetCallById';
import { is } from 'date-fns/locale';
import Loader from '@/components/ui/Loader';

const Meeting = ({ params}: {params:Promise<{ id: string }>}) => {

  const {id} = use(params);
  const {user, isLoaded} = useUser();
  const [isSetupComplete, setIsSetupComplete] =  useState(false);
  const {call, isCallLoading} = useGetCallById(id);

  if(!isLoaded || isCallLoading) {
    return <Loader/>
  }

  return (
    <main className = 'h-screen w-full '>
      <StreamCall call={call}>
         <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ):(
            <MeetingRoom />
          )}
         </StreamTheme>
      </StreamCall>
    </main>
  )
}

export default Meeting

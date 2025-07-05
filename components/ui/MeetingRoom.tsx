'use client'
import { cn } from '@/lib/utils'
import { CallControls, CallingState, CallParticipantsList, CallStats, CallStatsButton, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk'
import { LayoutList, Loader, Speaker, Users } from 'lucide-react'
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter, useSearchParams } from 'next/navigation'
import EndCallButton from './EndCallButton'

type CallLayoutType = 'speaker-left' | 'speaker-right' | 'grid'

const MeetingRoom = () => {
  const searchPrams = useSearchParams();
  const isPersonalRoom =  !!searchPrams.get('personal')
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left')
  const router = useRouter();
  const CallLayout = ()=>{
    switch(layout){
      case 'grid':
        return <PaginatedGridLayout/>
      case 'speaker-left':
        return <SpeakerLayout participantsBarPosition={'left'}/>
      default:
        return <SpeakerLayout participantsBarPosition={'right'}/>
    }
  }
  const [showParticipants, setShowParticipants] = useState(false);
  const {useCallCallingState} =  useCallStateHooks();

  const callingState = useCallCallingState();

  if(callingState != CallingState.JOINED) return <Loader/>


  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className=" flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] hidden ml-2', {
            'block': showParticipants,
            'hidden': !showParticipants
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>
      {/* video layout and call controls */}
      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5">
        <CallControls onLeave={() => router.push(`/dashboard`)} />
        
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
              <LayoutList size={20} className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  onClick={() =>
                    setLayout(item.toLowerCase() as CallLayoutType)
                  }
                >
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className=" cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]  ">
            <Users size={20} className="text-white" />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  )
}

export default MeetingRoom

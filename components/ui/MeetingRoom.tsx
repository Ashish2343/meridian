'use client'

import { cn } from '@/lib/utils'
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks
} from '@stream-io/video-react-sdk'
import { LayoutList, Loader, Users } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter, useSearchParams } from 'next/navigation'
import EndCallButton from './EndCallButton'
import VerticalRightLayout from './VerticalParticipantsGrid'
import CodeEditor from './CodeEditor'
import { useCall } from '@stream-io/video-react-sdk'

type CallLayoutType = 'speaker-left' | 'speaker-right' | 'vertical-right' | 'grid'
interface OpenEditorProps {
    isEditorOpen: boolean;
    setIsEditorOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MeetingRoom = () => {
  const searchParams = useSearchParams()
  const isPersonalRoom = !!searchParams.get('personal')
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left')
  const [showParticipants, setShowParticipants] = useState(false)
  const  [isEditorOpen, setIsEditorOpen] = useState(false);
  const router = useRouter()
  const call = useCall();
  console.log(call?.currentUserId);

  const { useCallCallingState } = useCallStateHooks()
  const callingState = useCallCallingState()

  if (callingState !== CallingState.JOINED) return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader className="animate-spin" />
    </div>
  )

   const handleOpenEditor = () => {
        console.log('Opening editor...');
        setLayout('vertical-right')
        setIsEditorOpen(true);
    };

    const handleCloseEditor = () => {
        console.log('Closing editor...');
        setLayout('grid')
        setIsEditorOpen(false);
    };


  const RenderCallLayout = () => {
    switch (layout) {
      case 'grid':
        return <PaginatedGridLayout />
      case 'speaker-left':
        return <SpeakerLayout participantsBarPosition="left" />
      case 'vertical-right':
        return  <VerticalRightLayout />
      default:
        return <SpeakerLayout participantsBarPosition="right" />
    }
  }

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <RenderCallLayout />
        </div>
        {/* Participants Sidebar */}
        <div
          className={cn('h-[calc(100vh-86px)] ml-2', {
            'block': showParticipants,
            'hidden': !showParticipants
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      {/* Controls */}
      <div className="fixed bottom-0 bg-red-400 flex w-full items-center justify-center gap-5">
        <CallControls onLeave={() => router.push(`/dashboard`)} />

        {/* Layout Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <LayoutList size={20} className="text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {[
              { label: 'Grid', value: 'grid' },
              { label: 'Speaker Left', value: 'speaker-left' },
              { label: 'Speaker Right', value: 'speaker-right' },
              { label: 'Vertical Right', value: 'vertical-right' }
            ].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem onClick={() => setLayout(item.value as CallLayoutType)}>
                  {item.label}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-dark-1" />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />

        {/* Participants Toggle */}
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
          </div>
        </button>

        {/* {CodeEditor} */}
         <div>
          {isEditorOpen ? (
          <>
            <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={ handleCloseEditor}>
           Close Editor
          </button>
            </>
         ) : (
          <button
         onClick={handleOpenEditor}
        className="bg-green-500 text-white px-4 py-2 rounded">
        Open Editor
        </button>)}
        </div>

        {/* End Call */}
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  )
}

export default MeetingRoom

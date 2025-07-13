'use client'

import React from 'react'
import { useCall, ParticipantView } from '@stream-io/video-react-sdk'
import CodeEditor from './CodeEditor'

const VerticalRightLayout = () => {
  const call = useCall()
  const participants = Array.from(call?.state.participants.values() || [])

  return (
    <div className="absolute top-0 left-0 right-0 bottom-[70px] flex z-10 pointer-events-none">
      {/* Code Editor */}
      <div className="flex-grow bg-amber-400 overflow-hidden pointer-events-auto">
        <CodeEditor />
      </div>

      {/* Participants Sidebar */}
      <div
        className="
          w-[300px]
          h-full
          overflow-y-auto
          bg-[#0f141b]
          border-l 
          border-[#1f2937]
          p-2
          space-y-2
          flex-shrink-0 flex-col
          items-center
          pointer-events-auto
          hidden sm:flex
        "
      >
        {participants.map((participant) => (
          <div
            key={participant.sessionId}
            className="w-full rounded-lg overflow-hidden bg-black"
            style={{ aspectRatio: '16/9' }}
          >
            <ParticipantView participant={participant} />
          </div>
        ))}
      </div>  
    </div>
  )
}

export default VerticalRightLayout

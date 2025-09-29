'use client'

import React, { useState } from 'react'
import { useCall, ParticipantView } from '@stream-io/video-react-sdk'
import CodeEditor from './CodeEditor'
import { CODE_SNIPPETS } from "@/constants/LanguageVersion"
import Split from 'react-split'

type Language = keyof typeof CODE_SNIPPETS

const VerticalRightLayout = () => {
  const call = useCall()
  const participants = Array.from(call?.state.participants.values() || [])

  // Editor state lives HERE
  const [language, setLanguage] = useState<Language>("javascript")
  const [code, setCode] = useState<string>(CODE_SNIPPETS["javascript"])

  return (
    <div className="absolute inset-0 flex z-10 pointer-events-none">
      <Split
        sizes={[75, 25]}          // initial sizes (percent)
        minSize={[400, 200]}      // min sizes for editor and sidebar
        gutterSize={5}            // draggable bar size
        className="flex w-full h-full pointer-events-auto"
        gutterAlign="center"
      >
        {/* Code Editor */}
        <div className="overflow-hidden bg-neutral-900">
          <CodeEditor
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
          />
        </div>

        {/* Participants Sidebar */}
        <div
          className="
            h-full
            overflow-y-auto
            bg-[#0f141b]
            border-l 
            border-[#1f2937]
            p-2
            space-y-2
            flex-shrink-0 flex-col
            items-center
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
      </Split>
    </div>
  )
}

export default VerticalRightLayout

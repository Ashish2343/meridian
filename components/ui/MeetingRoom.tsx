'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  CallControls,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
  useCall
} from '@stream-io/video-react-sdk';
import { LayoutList, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useSearchParams } from 'next/navigation';
import EndCallButton from './EndCallButton';
import VerticalRightLayout from './VerticalParticipantsGrid';
import { getSocket } from '@/lib/socket';
import { Socket } from 'socket.io-client';
import Image from 'next/image';

type CallLayoutType = 'speaker-left' | 'speaker-right' | 'vertical-right' | 'grid';

const MeetingRoom = ({ roomId }: { roomId: string }) => {
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get('personal');
  const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
  const [showParticipants, setShowParticipants] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const router = useRouter();
  const call = useCall();
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  const [showControls, setShowControls] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientY >= window.innerHeight - 100) {
        setShowControls(true);
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => setShowControls(false), 3000);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!roomId) return;

    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      console.log('✅ Connected to Socket.IO server');
      socket.emit('join-room', { roomId });
    };

    const handleToggleEditor = ({ isOpen }: { isOpen: boolean }) => {
      console.log('🟦 Client received toggle-editor:', isOpen);
      setIsEditorOpen(isOpen);
      setLayout(isOpen ? 'vertical-right' : 'grid');
    };

    socket.connect();
    socket.on('connect', handleConnect);
    socket.on('toggle-editor', handleToggleEditor);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('toggle-editor', handleToggleEditor);
      socket.disconnect();
    };
  }, [roomId]);

  const handleOpenEditor = () => {
    socketRef.current?.emit('toggle-editor', { roomId, isOpen: true });
  };

  const handleCloseEditor = () => {
    socketRef.current?.emit('toggle-editor', { roomId, isOpen: false });
  };

  const RenderCallLayout = React.memo(({ layout }: { layout: CallLayoutType }) => {
  switch (layout) {
    case 'grid':
      return <PaginatedGridLayout />;
    case 'speaker-left':
      return <SpeakerLayout participantsBarPosition="left" />;
    case 'vertical-right':
      return <VerticalRightLayout />;
    default:
      return <SpeakerLayout participantsBarPosition="right" />;
  }
});


  return (
    <section className="relative h-screen w-full overflow-hidden text-white bg-black">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <RenderCallLayout layout={layout} />
        </div>
        {showParticipants && (
          <div className="h-[calc(100vh-86px)] ml-2">
            <CallParticipantsList onClose={() => setShowParticipants(false)} />
          </div>
        )}
      </div>

      {/* Floating Controls */}
      <div
        className={cn(
          "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
          "bg-black/60 backdrop-blur-md rounded-2xl shadow-lg",
          "px-4 py-2 flex items-center gap-3",
          "transition-all duration-300",
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        )}
      >
        <CallControls onLeave={() => router.push(`/dashboard`)} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-2 rounded-full bg-[#19232d] hover:bg-[#2c3b4b] transition"
              aria-label="Change Layout"
            >
              <LayoutList size={20} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#1a1f24] text-white border border-[#2a2f35]">
            {[
              { label: 'Grid', value: 'grid' },
              { label: 'Speaker Left', value: 'speaker-left' },
              { label: 'Speaker Right', value: 'speaker-right' },
            ].map((item) => (
              <DropdownMenuItem
                key={item.value}
                onClick={() => setLayout(item.value as CallLayoutType)}
                className="cursor-pointer hover:bg-[#2a2f35]"
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />

        <button
          onClick={() => setShowParticipants((prev) => !prev)}
          className="p-2 rounded-full bg-[#19232d] hover:bg-[#2c3b4b] transition"
          aria-label="Toggle Participants"
        >
          <Users size={20} />
        </button>

        <button
          onClick={isEditorOpen ? handleCloseEditor : handleOpenEditor}
          className={cn(
            "flex items-center justify-center h-10 w-10 rounded-2xl transition-colors",
            isEditorOpen ? "bg-red-500 hover:bg-red-400 hover:shadow-[0_0_15px_0_rgba(255,255,255,0.1)]" : "bg-green-600 hover:bg-green-500 hover:shadow-[0_0_15px_0_rgba(255,255,255,0.1)]"
          )}
          aria-label={isEditorOpen ? "Close Editor" : "Open Editor"}
        >
          <Image  src="/icons/code.svg" alt="Code Editor" className="h-5 w-5" width={100} height={100} />
        </button>

        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
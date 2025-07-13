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
    if (!socketRef.current) {
      console.log('❌ Socket not ready yet');
      return;
    }
    console.log('🔹 Sending toggle-editor: true');
    socketRef.current.emit('toggle-editor', { roomId, isOpen: true });
  };

  const handleCloseEditor = () => {
    if (!socketRef.current) {
      console.log('❌ Socket not ready yet');
      return;
    }
    console.log('🔹 Sending toggle-editor: false');
    socketRef.current.emit('toggle-editor', { roomId, isOpen: false });
  };

  const RenderCallLayout = () => {
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
  };

  return (
    <section className="relative h-screen w-full overflow-hidden  text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <RenderCallLayout />
        </div>
        <div
          className={cn('h-[calc(100vh-86px)] ml-2', {
            'block': showParticipants,
            'hidden': !showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      {/* Floating Bottom Controls */}
    <div  className={cn(
    "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
    "bg-red-400/90 backdrop-blur-md rounded-xl",
    "px-4 py-2 flex items-center justify-center gap-3",
    "transition-transform duration-300",
    showControls ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
  )}>
    <CallControls onLeave={() => router.push(`/dashboard`)} />

    <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <LayoutList size={20} className="text-white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
            {[
                { label: 'Grid', value: 'grid' },
                { label: 'Speaker Left', value: 'speaker-left' },
                { label: 'Speaker Right', value: 'speaker-right' },
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

    <button onClick={() => setShowParticipants(prev => !prev)}>
        <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
            <Users size={20} className="text-white" />
        </div>
    </button>

    <div>
        {isEditorOpen ? (
            <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleCloseEditor}
            >
                Close Editor
            </button>
        ) : (
            <button
                onClick={handleOpenEditor}
                className="bg-green-500 text-white px-4 py-2 rounded"
            >
                Open Editor
            </button>
        )}
    </div>

    {!isPersonalRoom && <EndCallButton />}
</div>

    </section>
  );
};

export default MeetingRoom;

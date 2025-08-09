'use client';

import MeetingSetup from '@/components/ui/MeetingSetup';
import MeetingRoom from '@/components/ui/MeetingRoom';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React, { useState } from 'react';
import { useGetCallById } from '@/hooks/useGetCallById';
import Loader from '@/components/ui/Loader';

const Meeting = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const { user, isLoaded } = useUser();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(id);

  if (!isLoaded || isCallLoading || !call) return <Loader />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} call={call} />
          ) : (
            <MeetingRoom roomId={id} />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
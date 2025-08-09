'use client';

import { DeviceSettings, VideoPreview, type Call } from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react';
import { Button } from './button';

type MeetingSetupProps = {
  setIsSetupComplete: (v: boolean) => void;
  call: Call;
};

const MeetingSetup = ({ setIsSetupComplete, call }: MeetingSetupProps) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Enable/disable mic/cam before joining for faster start
  useEffect(() => {
    if (isMicCamToggledOn) {
      call.camera.disable().catch(console.error);
      call.microphone.disable().catch(console.error);
    } else {
      call.camera.enable().catch(console.error);
      call.microphone.enable().catch(console.error);
    }
  }, [isMicCamToggledOn, call]);

  const handleJoin = async () => {
    if (isJoining || call.state.callingState === 'joined') return; // avoid double join
    setIsJoining(true);
    try {
      await call.join();
      setIsSetupComplete(true);
    } catch (err) {
      console.error('Join failed:', err);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          />
          Mute/Unmute
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5 disabled:opacity-50"
        disabled={isJoining}
        onClick={handleJoin}
      >
        {isJoining ? 'Joining...' : 'Join Meeting'}
      </Button>
    </div>
  );
};

export default MeetingSetup;
